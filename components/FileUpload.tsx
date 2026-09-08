
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
    onFilesChange: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            const allFiles = [...uploadedFiles, ...newFiles];
            setUploadedFiles(allFiles);
            onFilesChange(allFiles);
        }
    };

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const newFiles = Array.from(event.dataTransfer.files);
            const allFiles = [...uploadedFiles, ...newFiles];
            setUploadedFiles(allFiles);
            onFilesChange(allFiles);
            event.dataTransfer.clearData();
        }
    }, [uploadedFiles, onFilesChange]);

    const handleDragEvents = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.type === 'dragenter' || event.type === 'dragover') {
            setIsDragging(true);
        } else if (event.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const removeFile = (fileName: string) => {
        const newFiles = uploadedFiles.filter(file => file.name !== fileName);
        setUploadedFiles(newFiles);
        onFilesChange(newFiles);
    };

    return (
        <div className="flex flex-col gap-4">
            <div
                onDrop={handleDrop}
                onDragEnter={handleDragEvents}
                onDragLeave={handleDragEvents}
                onDragOver={handleDragEvents}
                className={`relative group p-6 border-2 border-dashed rounded-lg text-center transition-colors duration-300 ${isDragging ? 'border-blue-400 bg-slate-700/50' : 'border-slate-600 hover:border-blue-500'}`}
            >
                <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 mb-3 text-slate-400 group-hover:text-blue-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-sm text-slate-300"><span className="font-semibold text-blue-400">Haz clic para subir</span> o arrastra y suelta</p>
                    <p className="text-xs text-slate-500">Solo archivos PDF</p>
                </label>
            </div>
            {uploadedFiles.length > 0 && (
                <div className="mt-2">
                    <h4 className="font-semibold text-slate-300 mb-2">Archivos subidos:</h4>
                    <ul className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                            <li key={index} className="flex justify-between items-center bg-slate-700/50 p-2 rounded-md text-sm">
                                <span className="text-slate-200 truncate pr-2">{file.name}</span>
                                <button onClick={() => removeFile(file.name)} className="text-red-400 hover:text-red-300 font-bold">&times;</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
