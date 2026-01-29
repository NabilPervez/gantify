import React, { useState, useRef } from 'react';
import { useDataContext } from '../context/DataContext';

export const MainDropZone: React.FC = () => {
    const { importFile, loadSampleData } = useDataContext();
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await importFile(files[0]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            await importFile(e.target.files[0]);
        }
    };

    const handleDownloadTemplate = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "ID,Name,Start,End,Type,Progress,Dependencies\n"
            + "1,Project Kickoff,2023-01-01,2023-01-02,task,100,\n"
            + "2,Development,2023-01-03,2023-01-10,task,50,1";

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "ganttify_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-[#101922] transition-colors duration-200 font-sans">
            {/* Header */}
            <header className="flex items-center px-6 py-5 justify-between bg-white dark:bg-[#101922] sticky top-0 z-10 border-b border-transparent dark:border-[#283039]">
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-[#137fec] flex items-center justify-center shadow-md shadow-blue-500/20">
                        <span className="material-symbols-outlined text-white text-xl">bar_chart</span>
                    </div>
                    <h2 className="text-[#111418] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Ganttify</h2>
                </div>
                <button className="flex items-center justify-center text-[#637588] dark:text-[#9dabb9] hover:text-[#137fec] transition-colors gap-1">
                    <span className="text-sm font-bold leading-normal">Help</span>
                    <span className="material-symbols-outlined text-lg">help</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col justify-center items-center p-4 gap-8 max-w-2xl mx-auto w-full -mt-16">

                {/* Intro */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#111418] dark:text-white tracking-tight">
                        Visualize Your Project
                    </h1>
                    <p className="text-[#637588] dark:text-[#9dabb9] text-base md:text-lg max-w-md mx-auto">
                        Turn your spreadsheets into interactive Gantt charts in seconds.
                    </p>
                </div>

                {/* Upload Hero Section */}
                <div className="w-full max-w-xl">
                    <div
                        className={`w-full flex flex-col items-center gap-8 rounded-2xl border-2 border-dashed ${isDragging ? 'border-[#137fec] bg-blue-50 dark:bg-blue-900/10' : 'border-[#dce0e5] dark:border-[#3b4754] bg-[#fcfcfd] dark:bg-[#1c2630]'} px-8 py-16 transition-all duration-300 hover:border-[#137fec]/50 group cursor-pointer shadow-sm`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv,.xlsx,.json"
                            onChange={handleFileSelect}
                        />

                        {/* File Icons Visualization */}
                        <div className="flex items-center justify-center gap-6 mb-2">
                            <div className="flex flex-col items-center gap-2 group-hover:-translate-y-2 transition-transform duration-300">
                                <span className="material-symbols-outlined text-green-500 text-5xl drop-shadow-sm">table_view</span>
                                <span className="text-[10px] font-bold text-[#637588] dark:text-[#9dabb9] uppercase tracking-wider">CSV</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 -mt-6 group-hover:-translate-y-2 transition-transform duration-300 delay-75">
                                <span className="material-symbols-outlined text-emerald-500 text-6xl drop-shadow-md">grid_on</span>
                                <span className="text-[10px] font-bold text-[#637588] dark:text-[#9dabb9] uppercase tracking-wider">Excel</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group-hover:-translate-y-2 transition-transform duration-300 delay-100">
                                <span className="material-symbols-outlined text-amber-500 text-5xl drop-shadow-sm">data_object</span>
                                <span className="text-[10px] font-bold text-[#637588] dark:text-[#9dabb9] uppercase tracking-wider">JSON</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-3 text-center">
                            <h3 className="text-[#111418] dark:text-white text-xl font-bold">Import Data</h3>
                            <button className="flex min-w-[160px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl h-12 px-6 bg-[#137fec] hover:bg-blue-600 text-white text-base font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                                <span className="material-symbols-outlined text-[24px]">folder_open</span>
                                <div>Browse Files</div>
                            </button>
                            <p className="text-[#637588] dark:text-[#9dabb9] text-xs mt-2">
                                Drag & Drop supported
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between mt-6 px-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDownloadTemplate(); }}
                            className="flex items-center gap-2 text-[#637588] dark:text-[#9dabb9] hover:text-[#137fec] dark:hover:text-white transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Download Template
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); loadSampleData(); }}
                            className="flex items-center gap-2 text-[#137fec] hover:text-blue-600 transition-colors text-sm font-bold"
                        >
                            <span>Load Sample Data</span>
                            <span className="material-symbols-outlined text-[18px] transform rotate-180">arrow_right_alt</span>
                        </button>
                    </div>
                </div>

                {/* Privacy Chip */}
                <div className="mt-8 flex justify-center w-full">
                    <div className="inline-flex h-8 items-center justify-center gap-x-2 rounded-full bg-gray-100 dark:bg-[#1c2630] px-4 border border-transparent dark:border-[#3b4754]">
                        <span className="material-symbols-outlined text-[#637588] dark:text-[#9dabb9] text-[16px]">lock</span>
                        <p className="text-[#637588] dark:text-[#9dabb9] text-xs font-medium">Data stays on your device</p>
                    </div>
                </div>

            </main>
        </div>
    );
};
