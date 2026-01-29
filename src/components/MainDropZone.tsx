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

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-[#101922] transition-colors duration-200 font-sans">
            {/* Header */}
            <header className="flex items-center px-4 py-4 justify-between bg-white dark:bg-[#101922] sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded bg-[#137fec] flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">bar_chart</span>
                    </div>
                    <h2 className="text-[#111418] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Ganttify</h2>
                </div>
                <button className="flex items-center justify-center text-[#637588] dark:text-[#9dabb9] hover:text-[#137fec] transition-colors">
                    <span className="text-base font-bold leading-normal tracking-[0.015em] mr-1">Help</span>
                    <span className="material-symbols-outlined text-xl">help</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-4 gap-6 max-w-lg mx-auto w-full">
                {/* Upload Hero Section */}
                <section className="flex flex-col items-center justify-center w-full">
                    <div
                        className={`w-full flex flex-col items-center gap-6 rounded-xl border-2 border-dashed ${isDragging ? 'border-[#137fec] bg-blue-50 dark:bg-blue-900/10' : 'border-[#dce0e5] dark:border-[#3b4754] bg-[#fcfcfd] dark:bg-[#1c2630]'} px-6 py-12 transition-colors hover:border-[#137fec]/50 group cursor-pointer`}
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
                        <div className="flex items-center justify-center gap-4 mb-2">
                            <div className="flex flex-col items-center gap-2 group-hover:-translate-y-1 transition-transform duration-300">
                                <div className="size-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center border border-green-200 dark:border-green-800">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">table_view</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#637588] dark:text-[#9dabb9] uppercase tracking-wider">CSV</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 -mt-6 group-hover:-translate-y-1 transition-transform duration-300 delay-75">
                                <div className="size-14 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-sm">
                                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-3xl">grid_on</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#637588] dark:text-[#9dabb9] uppercase tracking-wider">Excel</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group-hover:-translate-y-1 transition-transform duration-300 delay-100">
                                <div className="size-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center border border-amber-200 dark:border-amber-800">
                                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl">data_object</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#637588] dark:text-[#9dabb9] uppercase tracking-wider">JSON</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 text-center">
                            <h3 className="text-[#111418] dark:text-white text-xl font-bold leading-tight">Import Project Data</h3>
                            <p className="text-[#637588] dark:text-[#9dabb9] text-sm font-normal leading-normal max-w-[280px]">
                                Tap to browse or drag your project files here to visualize instantly.
                            </p>
                        </div>

                        <button className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#137fec] hover:bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-900/20 transition-all active:scale-95">
                            <span className="material-symbols-outlined mr-2 text-[20px]">folder_open</span>
                            <span className="truncate">Browse Files</span>
                        </button>
                    </div>
                </section>

                {/* Privacy Chip */}
                <div className="flex justify-center w-full">
                    <div className="inline-flex h-9 items-center justify-center gap-x-2 rounded-full bg-[#e8eef3] dark:bg-[#283039] pl-3 pr-4 border border-transparent dark:border-[#3b4754]">
                        <span className="material-symbols-outlined text-[#637588] dark:text-[#9dabb9] text-[18px]">lock</span>
                        <p className="text-[#111418] dark:text-white text-xs font-medium leading-normal">Data stays strictly on your device</p>
                    </div>
                </div>

                {/* Recent Projects Section (Mockup for now as per design) */}
                <section className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Recent Projects</h3>
                        <button onClick={loadSampleData} className="text-[#137fec] text-sm font-bold hover:underline">Sample</button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div onClick={loadSampleData} className="flex items-center gap-4 bg-white dark:bg-[#1c2630] px-4 min-h-[72px] py-3 justify-between rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3441] hover:bg-gray-50 dark:hover:bg-[#232e3a] transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center rounded-lg bg-[#137fec]/10 dark:bg-[#283039] shrink-0 size-12 group-hover:bg-[#137fec]/20 dark:group-hover:bg-[#343e4b] transition-colors">
                                    <span className="material-symbols-outlined text-[#137fec] dark:text-white text-[24px]">timeline</span>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-[#111418] dark:text-white text-base font-bold leading-normal line-clamp-1">Marketing Roadmap Q4</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="material-symbols-outlined text-[#637588] dark:text-[#9dabb9] text-[14px]">history</span>
                                        <p className="text-[#637588] dark:text-[#9dabb9] text-xs font-medium leading-normal line-clamp-1">Modified 2h ago</p>
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <span className="material-symbols-outlined text-[#9dabb9] group-hover:text-[#137fec] transition-colors text-[24px]">chevron_right</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white dark:bg-[#1c2630] px-4 min-h-[72px] py-3 justify-between rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3441] hover:bg-gray-50 dark:hover:bg-[#232e3a] transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center rounded-lg bg-[#137fec]/10 dark:bg-[#283039] shrink-0 size-12 group-hover:bg-[#137fec]/20 dark:group-hover:bg-[#343e4b] transition-colors">
                                    <span className="material-symbols-outlined text-[#137fec] dark:text-white text-[24px]">developer_board</span>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-[#111418] dark:text-white text-base font-bold leading-normal line-clamp-1">Website Redesign</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="material-symbols-outlined text-[#637588] dark:text-[#9dabb9] text-[14px]">history</span>
                                        <p className="text-[#637588] dark:text-[#9dabb9] text-xs font-medium leading-normal line-clamp-1">Modified Yesterday</p>
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <span className="material-symbols-outlined text-[#9dabb9] group-hover:text-[#137fec] transition-colors text-[24px]">chevron_right</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Action Button */}
            <button onClick={() => fileInputRef.current?.click()} className="fixed bottom-6 right-6 size-14 bg-[#137fec] rounded-full shadow-xl shadow-blue-900/30 flex items-center justify-center text-white hover:bg-blue-600 active:scale-95 transition-all z-20">
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>
        </div>
    );
};
