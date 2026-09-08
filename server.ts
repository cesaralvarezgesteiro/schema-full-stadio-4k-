import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { Scenario } from "./types";
import { getPrompt } from "./constants";

async function generateWithRetry(
  ai: GoogleGenAI,
  baseParams: Omit<Parameters<typeof ai.models.generateContent>[0], "model">,
  models = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-3.1-flash-lite"]
) {
  let lastError: unknown;
  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        return await ai.models.generateContent({
          ...baseParams,
          model,
        });
      } catch (err: unknown) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        const isTransient =
          msg.includes("503") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("high demand") ||
          msg.includes("429") ||
          msg.includes("RESOURCE_EXHAUSTED");
        if (isTransient) {
          console.warn(`Transient issue on ${model} (attempt ${attempt}). Trying next fallback...`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        throw err;
      }
    }
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support up to 50MB payloads for multiple base64-encoded PDF files
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Server-side Gemini API endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured in the server environment.",
        });
      }

      const { files, scenario, manualContext } = req.body as {
        files: Array<{ data: string; mimeType: string }>;
        scenario: Scenario;
        manualContext?: string;
      };

      if (!files || !files.length || !scenario) {
        return res.status(400).json({
          error: "Faltan los archivos PDF o el escenario seleccionado.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = getPrompt(scenario);

      const fileParts = files.map((file) => ({
        inlineData: {
          data: file.data,
          mimeType: file.mimeType || "application/pdf",
        },
      }));

      const contents: Array<
        | { inlineData: { data: string; mimeType: string } }
        | { text: string }
      > = [...fileParts, { text: prompt }];

      if (manualContext && manualContext.trim()) {
        contents.push({
          text: `\nIMPORTANTE - INFORMACIÓN MANUAL INTRODUCIDA POR EL USUARIO (TIENE PRIORIDAD SOBRE EL PDF):\n${manualContext}\n\nUsa estos datos manuales para sobrescribir o rellenar la información extraída del PDF si hay discrepancias o faltan datos.`,
        });
      }

      const response = await generateWithRetry(ai, {
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              css: { type: Type.STRING },
              html: { type: Type.STRING },
              js: { type: Type.STRING },
            },
            required: ["css", "html", "js"],
          },
        },
      });

      const rawText = response.text ? response.text.trim() : "";
      if (!rawText) {
        throw new Error("El modelo de IA devolvió una respuesta vacía.");
      }

      let parsedJson;
      try {
        parsedJson = JSON.parse(rawText);
      } catch (parseErr) {
        // Remove potential markdown fences if present
        const cleaned = rawText
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/, "");
        parsedJson = JSON.parse(cleaned);
      }

      return res.json(parsedJson);
    } catch (err: unknown) {
      console.error("Error in /api/generate:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido al procesar la solicitud.";
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
