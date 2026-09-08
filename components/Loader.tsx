
import React from 'react';

export const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-slate-300 font-semibold animate-pulse-fast">
                Analizando PDFs y generando código...
            </p>
        </div>
    );
};
