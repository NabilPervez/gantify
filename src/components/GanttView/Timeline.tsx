import React, { useMemo, useRef, useEffect, type CSSProperties } from 'react';
import * as ReactWindow from 'react-window';
// @ts-ignore
const List = ReactWindow.FixedSizeList || (ReactWindow as any).default?.FixedSizeList;
import type { Task, ViewSettings } from '../../types';
import { differenceInDays, addDays, format, isWeekend } from 'date-fns';

interface TimelineProps {
    tasks: Task[];
    viewSettings: ViewSettings;
    rowHeight: number;
    height: number;
    width: number;
    syncScrollTop: number;
    onScroll: (scrollOffset: number) => void;
}

const CONSTANTS = {
    day: { colWidth: 40, headerFormat: 'd' },
    week: { colWidth: 20, headerFormat: 'd' }, // Compressed days
    month: { colWidth: 5, headerFormat: '' }   // Very compressed
};

export const Timeline: React.FC<TimelineProps> = ({ tasks, viewSettings, rowHeight, height, width, syncScrollTop, onScroll }) => {
    const listRef = useRef<any>(null);

    // Sync scroll effect
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo(syncScrollTop);
        }
    }, [syncScrollTop]);

    // 1. Calculate Time Range
    const { minDate, totalDays } = useMemo(() => {
        if (tasks.length === 0) return { minDate: new Date(), maxDate: new Date(), totalDays: 0 };

        let min = new Date(tasks[0].start);
        let max = new Date(tasks[0].end);

        tasks.forEach(t => {
            if (t.start < min) min = new Date(t.start);
            if (t.end > max) max = new Date(t.end);
        });

        // Padding
        min = addDays(min, -7);
        max = addDays(max, 14);

        return {
            minDate: min,
            maxDate: max,
            totalDays: differenceInDays(max, min) + 1
        };
    }, [tasks]);

    const colWidth = CONSTANTS[viewSettings.zoom].colWidth;
    const contentWidth = totalDays * colWidth;

    // 2. Render Header
    const Header = () => {
        const days = [];
        for (let i = 0; i < totalDays; i++) {
            const d = addDays(minDate, i);
            const label = format(d, CONSTANTS[viewSettings.zoom].headerFormat);
            const isWknd = isWeekend(d);

            days.push(
                <div key={i}
                    className={`flex-shrink-0 border-r border-white/5 flex items-center justify-center text-[10px] ${isWknd ? 'bg-white/[0.02]' : ''}`}
                    style={{ width: colWidth, height: '100%' }}
                >
                    {label}
                </div>
            );
        }
        return <div className="flex h-10 border-b border-white/10 bg-[#242424]">{days}</div>;
    };

    // 3. Render Row
    const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
        const task = tasks[index];

        // Pos
        const startOffsetDay = differenceInDays(task.start, minDate);
        const durationDays = differenceInDays(task.end, task.start) + 1; // Inclusive

        const left = startOffsetDay * colWidth;
        const w = durationDays * colWidth;

        const bgClass = index % 2 === 0 ? 'bg-white/[0.02]' : 'transparent';
        const barColor = task.type === 'epic' ? 'bg-purple-500' : (task.progress === 100 ? 'bg-green-500' : 'bg-blue-500');

        return (
            <div style={style} className={`relative border-b border-white/5 ${bgClass} hover:bg-white/5`}>
                {/* Bar */}
                <div
                    className={`absolute top-2 h-6 rounded ${barColor} shadow-lg border border-white/10 flex items-center overflow-hidden`}
                    style={{
                        left: Math.max(0, left),
                        width: Math.max(colWidth, w),
                        opacity: 0.9
                    }}
                >
                    {/* Progress Fill */}
                    <div className="absolute top-0 bottom-0 left-0 bg-white/20" style={{ width: `${task.progress}%` }}></div>

                    {/* Label inside bar if wide enough */}
                    {(w > 50) && <span className="text-[10px] text-white px-2 truncate relative z-10 drop-shadow-md">{task.name}</span>}
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-[#1a1a1a] overflow-x-auto overflow-y-hidden" style={{ width }}>
            <div style={{ width: contentWidth, minWidth: '100%' }}>
                <Header />
                <List
                    height={height - 40}
                    itemCount={tasks.length}
                    itemSize={rowHeight}
                    width={Math.max(width, contentWidth)}
                    ref={listRef}
                    onScroll={({ scrollOffset }: { scrollOffset: number }) => onScroll(scrollOffset)}
                    style={{ overflowX: 'hidden' }}
                >
                    {Row}
                </List>
            </div>
        </div>
    );
};
