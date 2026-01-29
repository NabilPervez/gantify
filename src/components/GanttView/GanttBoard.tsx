import React, { useState, useRef } from 'react';
import { Timeline } from './Timeline';
import { TaskList } from './TaskList';
import { useDataContext } from '../../context/DataContext';

export const GanttBoard: React.FC = () => {
    const { ganttData, viewSettings, updateViewSettings, resetProject } = useDataContext();
    const [scrollTop, setScrollTop] = useState(0);
    const [sidebarWidth, setSidebarWidth] = useState(400); // Wider for more columns
    const containerRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef(false);

    const handleMouseDown = () => {
        isResizing.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'col-resize';
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current || !containerRef.current) return;
        const newWidth = e.clientX - containerRef.current.getBoundingClientRect().left;
        if (newWidth > 200 && newWidth < 800) {
            setSidebarWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
    };

    const onTaskListScroll = (offset: number) => {
        setScrollTop(offset);
    };

    if (!ganttData) return null;

    return (
        <div ref={containerRef} className="flex flex-col h-full overflow-hidden select-none bg-white font-sans text-[#333]">
            {/* Top Ribbon / Toolbar for MS Project look */}
            <div className="bg-[#f3f3f3] border-b border-[#dadada] flex flex-col">
                <div className="h-8 flex items-center px-2 bg-[#2b579a] text-white text-xs gap-4">
                    <span className="font-bold">File</span>
                    <span>Task</span>
                    <span>Resource</span>
                    <span>Report</span>
                    <span>Project</span>
                    <span>View</span>
                    <span className="ml-auto text-white/80 cursor-pointer hover:text-white" onClick={resetProject}>Close</span>
                </div>
                <div className="h-12 flex items-center px-4 gap-4 bg-[#f3f3f3]">
                    <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-[#e0e0e0] px-2 py-1 rounded">
                        <span className="material-symbols-outlined text-[20px] text-[#555]">zoom_in</span>
                        <span className="text-[10px] text-[#555]">Zoom</span>
                    </div>
                    <div className="h-8 w-[1px] bg-[#dadada]"></div>
                    <div className="flex bg-white border border-[#dadada] rounded p-0.5">
                        {(['Day', 'Week', 'Month'] as const).map(view => (
                            <button
                                key={view}
                                onClick={() => updateViewSettings({ zoom: view.toLowerCase() as any })}
                                className={`px-3 py-1 text-[11px] font-medium transition-colors ${viewSettings.zoom === view.toLowerCase() ? 'bg-[#cce8ff] text-[#2b579a] border border-[#99d1ff]' : 'text-[#333] hover:bg-[#f0f0f0]'}`}
                            >
                                {view}
                            </button>
                        ))}
                    </div>
                    <div className="h-8 w-[1px] bg-[#dadada]"></div>
                    <h1 className="ml-auto text-sm font-bold text-[#555] opacity-50">{ganttData.meta?.projectTitle || 'Untitled Project'}</h1>
                </div>
            </div>

            {/* Main Split View */}
            <div className="flex flex-1 min-h-0 relative">
                <div style={{ width: sidebarWidth }} className="flex-shrink-0 bg-white border-r border-[#bfbfbf] relative flex flex-col">
                    <TaskList
                        tasks={ganttData.tasks}
                        rowHeight={viewSettings.rowHeight || 40} // Updated row height standard
                        height={containerRef.current?.clientHeight ? containerRef.current.clientHeight - 80 : 800} // Adj for ribbon
                        width={sidebarWidth}
                        onScroll={onTaskListScroll}
                    />
                    {/* Resizer Handle */}
                    <div
                        className="absolute top-0 right-[-3px] w-[6px] h-full cursor-col-resize z-30 hover:bg-[#2b579a] transition-colors opacity-0 hover:opacity-100"
                        onMouseDown={handleMouseDown}
                    />
                </div>

                <div className="flex-1 bg-white min-w-0">
                    <Timeline
                        tasks={ganttData.tasks}
                        viewSettings={viewSettings}
                        rowHeight={viewSettings.rowHeight || 40}
                        height={containerRef.current?.clientHeight ? containerRef.current.clientHeight - 80 : 800}
                        width={800} // Will be auto-sized
                        syncScrollTop={scrollTop}
                        onScroll={onTaskListScroll}
                    />
                </div>
            </div>
        </div>
    );
};
