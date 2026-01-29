import React, { useCallback } from 'react';
import { useData } from '../context/DataContext';

export const MainDropZone: React.FC = () => {
    const { importFile, isLoading, error, loadSampleData } = useData();

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            importFile(e.dataTransfer.files[0]);
        }
    }, [importFile]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            importFile(e.target.files[0]);
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-6 relative overflow-hidden"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="z-10 max-w-xl w-full text-center space-y-8 backdrop-blur-sm bg-white/5 border border-white/10 p-12 rounded-3xl shadow-2xl">

                <div className="space-y-2">
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Ganttify
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Client-side Gantt charts. Secure, fast, and beautiful.
                    </p>
                </div>

                <div className="border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors rounded-2xl p-10 flex flex-col items-center justify-center space-y-4 group cursor-pointer bg-black/20"
                    onClick={() => document.getElementById('file-input')?.click()}
                >
                    <input
                        type="file"
                        id="file-input"
                        className="hidden"
                        accept=".csv,.xlsx,.xls,.json"
                        onChange={handleFileChange}
                    />
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">
                            Drop your CSV or Excel file here
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            or click to browse local files
                        </p>
                    </div>
                </div>

                {isLoading && <p className="text-blue-400 animate-pulse">Initializing engine...</p>}
                {error && <p className="text-red-400 bg-red-400/10 p-2 rounded-lg text-sm">{error}</p>}

                <div className="pt-4">
                    <button
                        onClick={(e) => { e.stopPropagation(); loadSampleData(); }}
                        className="text-sm text-gray-500 hover:text-white underline decoration-gray-700 underline-offset-4 transition-colors">
                        or try with sample data
                    </button>
                </div>
            </div>
        </div>
    );
};
