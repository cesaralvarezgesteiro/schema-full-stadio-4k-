import { Scenario, GeneratedCode } from '../types';

// Helper to convert File to base64 payload
const fileToBase64Payload = async (file: File): Promise<{ data: string; mimeType: string; name: string }> => {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                // Remove the data URI prefix 'data:...;base64,'
                const parts = reader.result.split(',');
                resolve(parts[1] || parts[0]);
            } else {
                reject(new Error(`No se pudo leer el archivo ${file.name}`));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });

    const data = await base64EncodedDataPromise;
    return {
        data,
        mimeType: file.type || 'application/pdf',
        name: file.name,
    };
};

export const generateWordPressCode = async (
    files: File[],
    scenario: Scenario,
    manualContext: string = ''
): Promise<GeneratedCode> => {
    try {
        const filePayloads = await Promise.all(files.map(fileToBase64Payload));

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                files: filePayloads,
                scenario,
                manualContext,
            }),
        });

        if (!response.ok) {
            let errorMsg = `Error en el servidor (${response.status})`;
            try {
                const errData = await response.json();
                if (errData?.error) {
                    errorMsg = errData.error;
                }
            } catch {
                // If not JSON, use default status text
                errorMsg = response.statusText || errorMsg;
            }
            throw new Error(errorMsg);
        }

        const data: GeneratedCode = await response.json();
        return data;
    } catch (error: unknown) {
        console.error("Error al generar código WordPress:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Ocurrió un error inesperado al comunicarse con el servidor.");
    }
};
