
import React, { useState } from 'react';

interface CodeBlockProps {
    title: string;
    language: string;
    code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ title, code }) => {
    const [copyText, setCopyText] = useState('Copiar');

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopyText('¡Copiado!');
            setTimeout(() => setCopyText('Copiar'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyText('Error');
             setTimeout(() => setCopyText('Copiar'), 2000);
        });
    };

    return (
        <div className="bg-slate-900/70 rounded-lg overflow-hidden border border-slate-700">
            <div className="flex justify-between items-center p-3 bg-slate-800 border-b border-slate-700">
                <h4 className="font-semibold text-slate-300 text-sm">{title}</h4>
                <button
                    onClick={handleCopy}
                    className="px-3 py-1 text-xs font-medium rounded-md transition-colors bg-slate-700 hover:bg-slate-600 text-slate-200"
                >
                    {copyText}
                </button>
            </div>
            <pre className="p-4 text-sm overflow-x-auto max-h-96">
                <code className="font-mono text-cyan-300 whitespace-pre-wrap break-words">
                    {code}
                </code>
            </pre>
        </div>
    );
};
