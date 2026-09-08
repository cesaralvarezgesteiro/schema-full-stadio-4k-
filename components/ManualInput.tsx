import React, { useState, useEffect } from 'react';
import { Scenario } from '../types';

interface ManualInputProps {
    scenario: Scenario;
    onContextChange: (context: string) => void;
}

export const ManualInput: React.FC<ManualInputProps> = ({ scenario, onContextChange }) => {
    const [formData, setFormData] = useState({
        competition: '',
        round: '',
        date: '',
        venue: '',
        homeTeam: '',
        homeCoach: '',
        awayTeam: '',
        awayCoach: '',
        scoreHome: '',
        scoreAway: '',
        notes: ''
    });

    // Update parent whenever form data changes
    useEffect(() => {
        const parts = [];
        if (formData.competition) parts.push(`Competición: ${formData.competition}`);
        if (formData.round) parts.push(`Jornada/Ronda: ${formData.round}`);
        if (formData.date) parts.push(`Fecha: ${formData.date}`);
        if (formData.venue) parts.push(`Estadio/Lugar: ${formData.venue}`);
        
        if (scenario === Scenario.MATCH) {
            if (formData.homeTeam) parts.push(`Equipo Local: ${formData.homeTeam}`);
            if (formData.homeCoach) parts.push(`Entrenador Local: ${formData.homeCoach}`);
            
            if (formData.awayTeam) parts.push(`Equipo Visitante: ${formData.awayTeam}`);
            if (formData.awayCoach) parts.push(`Entrenador Visitante: ${formData.awayCoach}`);
            
            if (formData.scoreHome || formData.scoreAway) parts.push(`Resultado: ${formData.scoreHome}-${formData.scoreAway}`);
        }

        if (formData.notes) parts.push(`NOTAS ADICIONALES/Instrucciones extra: ${formData.notes}`);

        const contextString = parts.length > 0 ? parts.join('\n') : '';
        onContextChange(contextString);
    }, [formData, scenario, onContextChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const inputClasses = "w-full p-2 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const labelClasses = "block text-xs font-semibold text-slate-400 mb-1";

    return (
        <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-600 mt-4 animate-[fadeIn_0.5s_ease-in-out]">
            <h4 className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Datos Manuales (Opcional)
            </h4>
            <p className="text-xs text-slate-400 mb-4">
                Si el PDF está incompleto o quieres forzar ciertos datos, escríbelos aquí. Estos datos tendrán prioridad sobre el PDF.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className={labelClasses}>Competición</label>
                    <input type="text" name="competition" placeholder="Ej: Tercera RFEF Grupo 1" value={formData.competition} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                    <label className={labelClasses}>Jornada / Ronda</label>
                    <input type="text" name="round" placeholder="Ej: Jornada 12" value={formData.round} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                    <label className={labelClasses}>Fecha</label>
                    <input type="text" name="date" placeholder="Ej: 24/09/2023" value={formData.date} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                    <label className={labelClasses}>Estadio / Lugar</label>
                    <input type="text" name="venue" placeholder="Ej: Campo Municipal de..." value={formData.venue} onChange={handleChange} className={inputClasses} />
                </div>
            </div>

            {scenario === Scenario.MATCH && (
                <div className="border-t border-slate-700 pt-4 mb-4">
                    <p className="text-xs text-blue-300 mb-3 font-semibold uppercase tracking-wider">Detalles del Partido</p>
                    
                    {/* Equipo Local */}
                    <div className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-4">
                                <label className={labelClasses}>Equipo Local</label>
                                <input type="text" name="homeTeam" placeholder="Nombre Local" value={formData.homeTeam} onChange={handleChange} className={inputClasses} />
                            </div>
                            <div className="md:col-span-4">
                                <label className={labelClasses}>Entrenador Local</label>
                                <input type="text" name="homeCoach" placeholder="Nombre Entrenador Local" value={formData.homeCoach} onChange={handleChange} className={inputClasses} />
                            </div>
                             <div className="md:col-span-4">
                                <label className={`${labelClasses}`}>Goles Local</label>
                                <input type="text" name="scoreHome" placeholder="0" value={formData.scoreHome} onChange={handleChange} className={`${inputClasses}`} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center my-2 text-slate-500 font-bold text-xs">VS</div>

                     {/* Equipo Visitante */}
                    <div className="mb-4">
                         <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-4">
                                <label className={labelClasses}>Equipo Visitante</label>
                                <input type="text" name="awayTeam" placeholder="Nombre Visitante" value={formData.awayTeam} onChange={handleChange} className={inputClasses} />
                            </div>
                             <div className="md:col-span-4">
                                <label className={labelClasses}>Entrenador Visitante</label>
                                <input type="text" name="awayCoach" placeholder="Nombre Entrenador Visitante" value={formData.awayCoach} onChange={handleChange} className={inputClasses} />
                            </div>
                             <div className="md:col-span-4">
                                <label className={`${labelClasses}`}>Goles Visitante</label>
                                <input type="text" name="scoreAway" placeholder="0" value={formData.scoreAway} onChange={handleChange} className={`${inputClasses}`} />
                            </div>
                        </div>
                    </div>

                </div>
            )}

            <div>
                <label className={labelClasses}>Notas Adicionales / Correcciones</label>
                <textarea 
                    name="notes" 
                    rows={3} 
                    placeholder="Ej: El árbitro en el PDF está mal, usar 'Pérez López'. Omitir tarjeta amarilla del minuto 90." 
                    value={formData.notes} 
                    onChange={handleChange} 
                    className={inputClasses} 
                />
            </div>
        </div>
    );
};