import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { TaskList } from './TaskList';
import { Timeline } from './Timeline';
import type { ViewSettings } from '../../types';

export const GanttBoard: React.FC = () => {
    const { ganttData, updateViewSettings } = useData();
    const [scrollTop, setScrollTop] = useState(0);
    const [sidebarWidth, setSidebarWidth] = useState(400);

    // Resizing Logic
    const isResizing = useRef(false);

    const startResize = () => {
        isResizing.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', stopResize);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current) return;
        const newWidth = e.clientX;
        if (newWidth > 200 && newWidth < 800) setSidebarWidth(newWidth);
    };

    const stopResize = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopResize);
    };

    if (!ganttData) return null;

    const handleZoom = (zoom: ViewSettings['zoom']) => {
        updateViewSettings({ zoom });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            {/* Toolbar */}
            <div className="h-12 bg-[#1a1a1a] border-b border-white/10 flex items-center px-4 space-x-4">
                <span className="text-gray-400 text-sm font-medium">Zoom:</span>
                <div className="flex bg-black/20 rounded p-1">
                    {['day', 'week', 'month'].map((z) => (
                        <button
                            key={z}
                            onClick={() => handleZoom(z as any)}
                            className={`px-3 py-1 text-xs rounded uppercase ${ganttData.viewSettings.zoom === z ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-white'}`}
                        >
                            {z}
                        </button>
                    ))}
                </div>
            </div>

            {/* Workspace */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Sidebar */}
                <div style={{ width: sidebarWidth }} className="flex-shrink-0 relative z-10">
                    <TaskList
                        tasks={ganttData.tasks}
                        rowHeight={40}
                        height={window.innerHeight - 64 - 48} // Window - Header - Toolbar roughly. 
                        // Better to use a hook for height but this works for fixed viewport apps
                        width={sidebarWidth}
                        onScroll={setScrollTop}
                        listRef={useRef<any>(null)}
                    />
                </div>

                {/* Resizer Handle */}
                <div
                    className="w-1 bg-white/10 hover:bg-blue-500 cursor-col-resize z-20 transition-colors"
                    onMouseDown={startResize}
                />

                {/* Timeline */}
                <div className="flex-1 overflow-hidden bg-[#1a1a1a]">
                    <Timeline
                        tasks={ganttData.tasks}
                        viewSettings={ganttData.viewSettings}
                        rowHeight={40}
                        height={window.innerHeight - 64 - 48}
                        width={window.innerWidth - sidebarWidth}
                        syncScrollTop={scrollTop}
                        onScroll={setScrollTop}
                    />
                </div>
            </div>
        </div>
    );
};
