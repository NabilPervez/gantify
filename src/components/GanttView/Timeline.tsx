import React, { useMemo, useRef, useEffect, type CSSProperties } from 'react';
import { List } from 'react-window';
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
    day: { colWidth: 40, bottomFormat: 'd', topFormat: 'MMMM yyyy' },
    week: { colWidth: 20, bottomFormat: 'd', topFormat: 'MMM yyyy' },
    month: { colWidth: 10, bottomFormat: '', topFormat: 'yyyy' }
};

export const Timeline: React.FC<TimelineProps> = ({ tasks, viewSettings, rowHeight, height, width, syncScrollTop, onScroll }) => {
    const listRef = useRef<any>(null);

    useEffect(() => {
        if (listRef.current && typeof listRef.current.scrollTo === 'function') {
            listRef.current.scrollTo(syncScrollTop);
        }
    }, [syncScrollTop]);

    const { minDate, totalDays } = useMemo(() => {
        if (tasks.length === 0) return { minDate: new Date(), maxDate: new Date(), totalDays: 0 };
        let min = new Date(tasks[0].start);
        let max = new Date(tasks[0].end);
        tasks.forEach(t => {
            if (t.start < min) min = new Date(t.start);
            if (t.end > max) max = new Date(t.end);
        });
        min = addDays(min, -7);
        max = addDays(max, 30); // More padding for visual comfort
        return { minDate: min, maxDate: max, totalDays: differenceInDays(max, min) + 1 };
    }, [tasks]);

    const colWidth = CONSTANTS[viewSettings.zoom].colWidth;
    const contentWidth = totalDays * colWidth;

    // Header Rendering Logic (Two Tiers)
    const Header = () => {
        const topTier = [];
        const bottomTier = [];
        let currentMonth = '';
        let monthWidth = 0;

        for (let i = 0; i < totalDays; i++) {
            const d = addDays(minDate, i);
            const isWknd = isWeekend(d);

            // Bottom Tier (Days)
            bottomTier.push(
                <div key={i}
                    className={`flex-shrink-0 border-r border-[#e0e0e0] flex items-center justify-center text-[10px] text-[#555] ${isWknd ? 'bg-[#f7f7f7]' : 'bg-white'}`}
                    style={{ width: colWidth, height: 20 }}
                >
                    {format(d, CONSTANTS[viewSettings.zoom].bottomFormat).charAt(0)}
                </div>
            );

            // Top Tier (Months/Weeks grouping) - Simplified to Monthly grouping for 'day' view
            // Better logic: accumulate width until month changes
            const monthLabel = format(d, CONSTANTS[viewSettings.zoom].topFormat);
            if (monthLabel !== currentMonth) {
                if (currentMonth !== '') {
                    topTier.push(
                        <div key={currentMonth} className="flex items-center px-2 border-r border-[#e0e0e0] bg-[#f0f0f0] text-[11px] font-bold text-[#333] whitespace-nowrap overflow-hidden"
                            style={{ width: monthWidth * colWidth, height: 20 }}>
                            {currentMonth}
                        </div>
                    );
                }
                currentMonth = monthLabel;
                monthWidth = 1;
            } else {
                monthWidth++;
            }
        }
        // Push last month
        if (monthWidth > 0) {
            topTier.push(
                <div key={currentMonth + 'last'} className="flex items-center px-2 border-r border-[#e0e0e0] bg-[#f0f0f0] text-[11px] font-bold text-[#333] whitespace-nowrap overflow-hidden"
                    style={{ width: monthWidth * colWidth, height: 20 }}>
                    {currentMonth}
                </div>
            );
        }

        return (
            <div className="flex flex-col border-b border-[#bfbfbf] sticky top-0 z-20 shadow-sm">
                <div className="flex bg-[#f0f0f0]">{topTier}</div>
                <div className="flex bg-white">{bottomTier}</div>
            </div>
        );
    };

    const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
        const task = tasks[index];
        const startOffsetDay = differenceInDays(task.start, minDate);
        const durationDays = differenceInDays(task.end, task.start) + 1;
        const left = startOffsetDay * colWidth;
        const w = durationDays * colWidth;

        // Visual style for bar
        // MS Project style: Blue rectangle with darker progress bar inside.
        // Epic: Black bracket? Or just distinct bar.
        const isEpic = task.type === 'epic';

        const barColor = isEpic ? 'bg-[#333]' : 'bg-[#5c97bd]'; // MS Project blueish
        const progressColor = 'bg-[#3e6985]'; // Darker blue

        // Today line? Only relevant if today is in range. 
        // We handle grid vertical lines via CSS background repeating linear gradient or simple border-right on container? 
        // Rendering 1000s of divs for grid lines in every row is expensive.
        // Instead, we can use a background image on the row container.
        const gridGradient = `repeating-linear-gradient(to right, transparent, transparent ${colWidth - 1}px, #f0f0f0 ${colWidth - 1}px, #f0f0f0 ${colWidth}px)`;

        return (
            <div style={{ ...style, backgroundImage: gridGradient }} className={`relative border-b border-[#ebebeb] hover:bg-[#fafafa]`}>
                {/* Task Bar */}
                <div
                    className={`absolute top-1.5 h-3.5 ${barColor} border border-[#406a8c] flex items-center overflow-hidden transition-all hover:opacity-90`}
                    style={{
                        left: Math.max(0, left),
                        width: Math.max(colWidth, w),
                        borderRadius: isEpic ? 0 : 2,
                        clipPath: isEpic ? 'polygon(0% 0%, 100% 0%, 100% 100%, 95% 80%, 5% 80%, 0% 100%)' : undefined // Basic brace shape attempt
                    }}
                >
                    {/* Progress */}
                    <div className={`h-full ${progressColor}`} style={{ width: `${task.progress}%` }}></div>
                </div>
                {/* Side Label */}
                <div
                    className="absolute text-[10px] text-[#333] ml-2 whitespace-nowrap"
                    style={{ left: Math.max(0, left) + Math.max(colWidth, w) }}
                >
                    {/* {task.name} */}
                </div>
            </div>
        );
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        onScroll(e.currentTarget.scrollLeft);
    };

    const ListComponent = List as any;

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden select-none" style={{ width }}>
            <div style={{ width: contentWidth, minWidth: '100%' }}>
                <Header />
                {/* Today Line Indicator (Overlay) */}
                <div className="relative">
                    <div className="absolute top-0 bottom-0 z-10 border-l border-red-500 border-dashed opacity-50 pointer-events-none"
                        style={{ left: differenceInDays(new Date(), minDate) * colWidth, height: height - 40 }}></div>
                    <ListComponent
                        rowCount={tasks.length}
                        rowHeight={rowHeight}
                        width={Math.max(width, contentWidth)}
                        height={height - 40} // Adjust for 2-row header (20+20=40)
                        ref={listRef}
                        onScroll={handleScroll}
                        rowComponent={Row as any}
                        style={{ overflowX: 'hidden' }}
                        rowProps={{}}
                    />
                </div>
            </div>
        </div>
    );
};
