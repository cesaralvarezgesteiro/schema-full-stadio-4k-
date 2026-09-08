
import React from 'react';
import { Scenario } from '../types';

interface ScenarioSelectorProps {
    value: Scenario | '';
    onChange: (value: Scenario | '') => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ value, onChange }) => {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as Scenario | '')}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
                <option value="" disabled>-- Selecciona un tipo de reporte --</option>
                <option value={Scenario.RESULTS}>A: Reporte de RESULTADOS (Jornada Completa - Lista)</option>
                <option value={Scenario.PREVIEW}>B: PREVIA de Jornada (Jornada Completa - Lista)</option>
                <option value={Scenario.MATCH}>C: Reporte de PARTIDO ÚNICO (Ficha Técnica)</option>
                <option value={Scenario.PREVIEW_CHRONICLE}>D: CRÓNICA PREVIA (Requiere PDF Previa + Clasificación)</option>
                <option value={Scenario.RESULTS_CHRONICLE}>E: CRÓNICA RESUMEN (Requiere PDF Resultados + Clasificación)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
};
