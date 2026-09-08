import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ScenarioSelector } from './components/ScenarioSelector';
import { ManualInput } from './components/ManualInput';
import { Loader } from './components/Loader';
import { CodeBlock } from './components/CodeBlock';
import { GeneratedCode, Scenario } from './types';
import { generateWordPressCode } from './services/geminiService';

export default function App(): React.ReactElement {
    const [files, setFiles] = useState<File[]>([]);
    const [scenario, setScenario] = useState<Scenario | ''>('');
    const [manualContext, setManualContext] = useState<string>('');
    const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFilesChange = useCallback((newFiles: File[]) => {
        setFiles(newFiles);
        // Reset subsequent steps if files change
        setGeneratedCode(null);
        setError(null);
    }, []);

    const handleScenarioChange = useCallback((newScenario: Scenario | '') => {
        setScenario(newScenario);
        // Reset manual context when scenario changes to avoid stale data structure
        setManualContext('');
    }, []);

    const handleManualContextChange = useCallback((context: string) => {
        setManualContext(context);
    }, []);

    const handleGenerate = async () => {
        if (!files.length || !scenario) {
            setError('Por favor, sube los archivos PDF y selecciona un escenario.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedCode(null);

        try {
            const result = await generateWordPressCode(files, scenario as Scenario, manualContext);
            setGeneratedCode(result);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Error al generar el código: ${errorMessage}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFiles([]);
        setScenario('');
        setManualContext('');
        setGeneratedCode(null);
        setError(null);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-5xl">
                <header className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                        Stadio4K WordPress Code Generator
                    </h1>
                    <p className="mt-2 text-slate-400 text-sm sm:text-base">
                        Transforma PDFs de datos de fútbol en código listo para publicar.
                    </p>
                </header>

                <main className="bg-slate-800/50 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-sm border border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : generatedCode ? (
                        <div className="flex flex-col gap-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-green-400">¡Código Generado con Éxito!</h2>
                                <p className="text-slate-400 mt-1">Copia y pega estos bloques en tu sitio de WordPress.</p>
                            </div>
                            <CodeBlock title="1. CSS (Apariencia > Personalizar > CSS Adicional)" language="css" code={generatedCode.css} />
                            <CodeBlock title="2. HTML (Editor de Entradas)" language="html" code={generatedCode.html} />
                            <CodeBlock title="3. JavaScript (Bloque HTML al final de la Entrada)" language="html" code={generatedCode.js} />
                            <button
                                onClick={handleReset}
                                className="w-full sm:w-auto mx-auto mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                            >
                                Empezar de Nuevo
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-cyan-300">Paso 1: Sube tus archivos PDF</h3>
                                <FileUpload onFilesChange={handleFilesChange} />
                            </div>

                            {files.length > 0 && (
                                <div className="animate-[fadeIn_0.5s_ease-in-out]">
                                    <h3 className="text-xl font-semibold mb-2 text-cyan-300">Paso 2: Elige el escenario</h3>
                                    <ScenarioSelector value={scenario} onChange={handleScenarioChange} />
                                </div>
                            )}

                            {scenario && (
                                <div className="animate-[fadeIn_0.5s_ease-in-out]">
                                     <h3 className="text-xl font-semibold mb-2 text-cyan-300">Paso 3: Datos Manuales (Opcional)</h3>
                                     <ManualInput scenario={scenario} onContextChange={handleManualContextChange} />
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg animate-[fadeIn_0.5s_ease-in-out]">
                                    <p className="font-semibold">Error</p>
                                    <p>{error}</p>
                                </div>
                            )}
                            
                            <button
                                onClick={handleGenerate}
                                disabled={!scenario || files.length === 0 || isLoading}
                                className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 disabled:scale-100"
                            >
                                Generar Código
                            </button>
                        </div>
                    )}
                </main>
                 <footer className="text-center mt-8 text-xs text-slate-500">
                    <p>Powered by Google Gemini & Ethan Media TV. For internal use at futbol.ethanalvarez.top.</p>
                </footer>
            </div>
        </div>
    );
}