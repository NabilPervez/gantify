import React, { type CSSProperties, type UIEvent } from 'react';
import { List } from 'react-window';
import type { Task } from '../../types';
import { format, differenceInBusinessDays } from 'date-fns';

interface TaskListProps {
    tasks: Task[];
    rowHeight: number;
    height: number;
    width: number;
    onScroll?: (scrollOffset: number) => void;
    listRef?: any;
}

const ColumnHeader: React.FC = () => (
    <div className="flex items-center h-8 border-b border-r border-[#bfbfbf] bg-[#f0f0f0] text-[11px] font-bold text-[#333] select-none sticky top-0 z-10">
        <div className="w-10 flex-shrink-0 text-center border-r border-[#bfbfbf] h-full flex items-center justify-center bg-[#f0f0f0]">ID</div>
        <div className="w-8 flex-shrink-0 text-center border-r border-[#bfbfbf] h-full flex items-center justify-center bg-[#f0f0f0]">
            <span className="material-symbols-outlined text-[14px]">info</span>
        </div>
        <div className="flex-1 px-2 border-r border-[#bfbfbf] h-full flex items-center whitespace-nowrap bg-[#f0f0f0]">Task Name</div>
        <div className="w-20 px-2 border-r border-[#bfbfbf] h-full flex items-center bg-[#f0f0f0]">Duration</div>
        <div className="w-24 px-2 border-r border-[#bfbfbf] h-full flex items-center bg-[#f0f0f0]">Start</div>
        <div className="w-24 px-2 border-r border-[#bfbfbf] h-full flex items-center bg-[#f0f0f0]">Finish</div>
        <div className="w-24 px-2 h-full flex items-center bg-[#f0f0f0]">Predecessors</div>
    </div>
);

export const TaskList: React.FC<TaskListProps> = ({ tasks, rowHeight, height, width, listRef, onScroll }) => {

    const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
        const task = tasks[index];
        const duration = differenceInBusinessDays(task.end, task.start) + 1;
        const durationStr = `${duration} day${duration !== 1 ? 's' : ''}`;

        // Indentation based on simple logic (if it has parent, visually indent? Data structure is flat list currently, assuming displayOrder implies hierarchy or type 'subtask' implies indentation)
        // We'll use task.type for basic indentation
        const indent = task.type === 'subtask' ? 24 : (task.type === 'task' ? 12 : 4);
        const fontWeight = task.type === 'epic' ? 'font-bold' : 'font-normal';

        return (
            <div style={style} className={`flex items-center text-[11px] text-[#333] bg-white border-b border-[#ebebeb] hover:bg-[#e6f2ff] transition-colors`}>
                <div className="w-10 flex-shrink-0 text-center border-r border-[#ebebeb] h-full flex items-center justify-center bg-[#f9f9f9] text-gray-500">{index + 1}</div>
                <div className="w-8 flex-shrink-0 text-center border-r border-[#ebebeb] h-full flex items-center justify-center">
                    {task.type === 'epic' && <span className="material-symbols-outlined text-[14px] text-purple-600">folder</span>}
                    {task.type === 'task' && <span className="material-symbols-outlined text-[14px] text-blue-500">task</span>}
                    {task.type === 'subtask' && <span className="material-symbols-outlined text-[14px] text-gray-400">subdirectory_arrow_right</span>}
                </div>
                <div className="flex-1 px-2 border-r border-[#ebebeb] h-full flex items-center truncate text-left" style={{ paddingLeft: indent }}>
                    <span className={fontWeight}>{task.name}</span>
                </div>
                <div className="w-20 px-2 border-r border-[#ebebeb] h-full flex items-center justify-end">{durationStr}</div>
                <div className="w-24 px-2 border-r border-[#ebebeb] h-full flex items-center justify-end">{format(task.start, 'M/d/yyyy')}</div>
                <div className="w-24 px-2 border-r border-[#ebebeb] h-full flex items-center justify-end">{format(task.end, 'M/d/yyyy')}</div>
                <div className="w-24 px-2 h-full flex items-center justify-end text-gray-400">{task.dependencies?.join(', ')}</div>
            </div>
        );
    };

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        if (onScroll) {
            onScroll(e.currentTarget.scrollTop);
        }
    };

    const ListComponent = List as any;

    return (
        <div className="flex flex-col border-r border-[#bfbfbf] h-full bg-white select-none font-sans">
            <ColumnHeader />
            <div className="flex-1">
                <ListComponent
                    rowCount={tasks.length}
                    rowHeight={rowHeight}
                    width={width}
                    height={height - 32} // header height adjustment
                    ref={listRef}
                    onScroll={handleScroll}
                    rowComponent={Row as any}
                    rowProps={{}}
                />
            </div>
        </div>
    );
};
