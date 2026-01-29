import React, { useState, useRef } from 'react';
import { Timeline } from './Timeline';
import { TaskList } from './TaskList';
import { useDataContext } from '../../context/DataContext';

export const GanttBoard: React.FC = () => {
    const { ganttData, viewSettings, updateViewSettings, resetProject } = useDataContext();
    const [scrollTop, setScrollTop] = useState(0);

    const [sidebarWidth, setSidebarWidth] = useState(300);
    const containerRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef(false);

    const handleMouseDown = () => {
        isResizing.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current || !containerRef.current) return;
        const newWidth = e.clientX - containerRef.current.getBoundingClientRect().left;
        if (newWidth > 150 && newWidth < 600) {
            setSidebarWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const onTaskListScroll = (offset: number) => {
        setScrollTop(offset);
    };

    if (!ganttData) return null;

    return (
        <div ref={containerRef} className="flex flex-col h-full overflow-hidden select-none">
            {/* Toolbar / Zoom Controls */}
            <div className="h-12 border-b border-black flex items-center px-4 gap-4 bg-white dark:bg-[#101922] dark:border-[#283039]">
                <div className="flex bg-[#333] dark:bg-[#283039] rounded p-1 gap-1">
                    {(['Day', 'Week', 'Month'] as const).map((view) => (
                        <button
                            key={view}
                            onClick={() => updateViewSettings({ zoom: view.toLowerCase() as any })}
                            className={`flex-1 flex items-center justify-center rounded-[4px] text-sm font-bold transition-all h-full
                            ${viewSettings.zoom === view.toLowerCase()
                                    ? 'bg-white dark:bg-[#101922] text-[#137fec] shadow-sm'
                                    : 'text-[#4e5d6c] dark:text-[#9dabb9] hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            {view}
                        </button>
                    ))}
                </div>

                <button onClick={resetProject} className="ml-auto text-sm text-red-500 hover:underline">
                    Close Project
                </button>
            </div>

            <div className="flex flex-1 min-h-0 relative">
                <div style={{ width: sidebarWidth }} className="flex-shrink-0 bg-white dark:bg-[#101922] border-r border-[#e5e7eb] dark:border-[#283039] relative">
                    <TaskList
                        tasks={ganttData.tasks}
                        rowHeight={viewSettings.rowHeight}
                        height={containerRef.current?.clientHeight ? containerRef.current.clientHeight - 48 : 800}
                        width={sidebarWidth}
                        onScroll={onTaskListScroll}
                    />
                    {/* Resizer Handle */}
                    <div
                        className="absolute top-0 right-[-5px] w-[10px] h-full cursor-col-resize z-20 hover:bg-blue-500/10"
                        onMouseDown={handleMouseDown}
                    />
                </div>

                <div className="flex-1 bg-white dark:bg-[#101922] min-w-0">
                    <Timeline
                        tasks={ganttData.tasks}
                        viewSettings={viewSettings}
                        rowHeight={viewSettings.rowHeight}
                        height={containerRef.current?.clientHeight ? containerRef.current.clientHeight - 48 : 800}
                        width={800} // Will be auto-sized by internal logic or wrapper
                        syncScrollTop={scrollTop}
                        onScroll={onTaskListScroll} // Two-way sync
                    />
                </div>
            </div>
        </div>
    );
};
