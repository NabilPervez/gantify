import React, { type CSSProperties, type UIEvent } from 'react';
import { List } from 'react-window';
import type { Task } from '../../types';
import { format } from 'date-fns';

interface TaskListProps {
    tasks: Task[];
    rowHeight: number;
    height: number;
    width: number;
    onScroll?: (scrollOffset: number) => void;
    listRef?: any;
}

const ColumnHeader: React.FC = () => (
    <div className="flex items-center h-10 border-b border-white/10 bg-[#242424] text-xs font-semibold text-gray-400">
        <div className="w-8 flex-shrink-0 text-center border-r border-white/5">#</div>
        <div className="flex-1 px-4 border-r border-white/5 truncate">Task Name</div>
        <div className="w-24 px-2 border-r border-white/5 truncate">Start</div>
        <div className="w-24 px-2 border-r border-white/5 truncate">End</div>
        <div className="w-12 px-2 text-center">status</div>
    </div>
);

export const TaskList: React.FC<TaskListProps> = ({ tasks, rowHeight, height, width, listRef, onScroll }) => {

    const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
        const task = tasks[index];
        // Alternate row bg
        const bgClass = index % 2 === 0 ? 'bg-white/[0.02]' : 'transparent';

        return (
            <div style={style} className={`flex items-center text-sm text-gray-300 border-b border-white/5 ${bgClass} hover:bg-white/5 transition-colors`}>
                <div className="w-8 flex-shrink-0 text-center text-gray-600 text-xs">{index + 1}</div>
                <div className="flex-1 px-4 truncate flex items-center gap-2">
                    {task.type === 'epic' && <span className="w-2 h-2 rounded-full bg-purple-500"></span>}
                    {task.type === 'subtask' && <span className="ml-4 w-1 h-1 rounded-full bg-gray-500"></span>}
                    {task.name}
                </div>
                <div className="w-24 px-2 text-xs text-gray-500 truncate">{format(task.start, 'MMM d')}</div>
                <div className="w-24 px-2 text-xs text-gray-500 truncate">{format(task.end, 'MMM d')}</div>
                <div className="w-12 px-2 text-center text-xs">
                    <span className={`px-1.5 py-0.5 rounded ${task.progress === 100 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {task.progress}%
                    </span>
                </div>
            </div>
        );
    };

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        if (onScroll) {
            onScroll(e.currentTarget.scrollTop);
        }
    };

    return (
        <div className="flex flex-col border-r border-white/10 h-full bg-[#1a1a1a]">
            <ColumnHeader />
            <List
                rowCount={tasks.length}
                rowHeight={rowHeight}
                listRef={listRef}
                onScroll={handleScroll}
                rowComponent={Row as any}
                style={{ height: height - 40, width }}
                rowProps={{}}
            />
        </div>
    );
};
