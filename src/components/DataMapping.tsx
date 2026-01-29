import React from 'react';
import { useDataContext } from '../context/DataContext';

export const DataMapping: React.FC = () => {
    const { ganttData, confirmMapping, cancelMapping } = useDataContext();

    // Placeholder for data mapping component
    // This will be implemented fully once we hook up the view switching logic
    return (
        <div className="relative flex h-full min-h-screen w-full flex-col pb-24 bg-white dark:bg-[#101922] font-sans">
            {/* TopAppBar */}
            <div className="sticky top-0 z-20 flex items-center bg-white dark:bg-[#101922] p-4 border-b border-gray-200 dark:border-gray-800 justify-between">
                <div onClick={cancelMapping} className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Map Your Data</h2>
            </div>
            <div className="p-4">
                <p className="text-slate-600 dark:text-gray-400 text-sm font-normal leading-normal">
                    Match your file columns to the required Gantt fields. We've auto-detected some matches for you.
                </p>
                {/* Mockup content from user request */}
                <div className="mt-4 p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
                    <p className="text-sm">Mapping UI Placeholder (Found {ganttData?.tasks.length || 0} tasks)</p>
                </div>
            </div>
            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-[#101922]/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50 flex flex-col gap-3">
                <button onClick={confirmMapping} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#137fec] px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 active:scale-[0.98] transition-all">
                    <span className="material-symbols-outlined text-[20px]">analytics</span>
                    Confirm & Generate
                </button>
                <button onClick={cancelMapping} className="w-full text-sm font-medium text-slate-500 dark:text-gray-500 hover:text-slate-800 dark:hover:text-gray-300 py-1">
                    Cancel
                </button>
            </div>
        </div>
    );
};
