import { v4 as uuidv4 } from 'uuid';
import type { GanttData, Task, TaskType } from '../types';
import { isValid } from 'date-fns';

// PRD Regex Patterns
const PATTERNS = {
    ID: /^(id|task_?id|key)$/i,
    NAME: /^(name|task|title|summary|description)$/i,
    START: /^(start(_?date)?|begin|kickoff)$/i,
    END: /^(end(_?date)?|due|finish|deadline)$/i,
    TYPE: /^(type|category|hierarchy)$/i,
    DEPENDENCIES: /^(dep(endenc(yies))?|predecessors?|parent)$/i,
    PROGRESS: /^(progress|%|status|done)$/i,
};

// Helper: Find matching column header
const findHeader = (headers: string[], pattern: RegExp): string | undefined => {
    return headers.find(h => pattern.test(h));
};

// Helper: Parse Date with simple heuristics
const parseDate = (value: any): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return value;

    const d = new Date(value);
    if (isValid(d)) return d;

    // Try common formats if needed, but new Date() covers ISO and many others
    return null;
};

export const mapRawDataToGantt = (rawData: any[], fileName: string): GanttData => {
    if (!rawData || rawData.length === 0) {
        throw new Error("File is empty");
    }

    const headers = Object.keys(rawData[0]);

    // Identify Mappings
    const map = {
        id: findHeader(headers, PATTERNS.ID),
        name: findHeader(headers, PATTERNS.NAME),
        start: findHeader(headers, PATTERNS.START),
        end: findHeader(headers, PATTERNS.END),
        type: findHeader(headers, PATTERNS.TYPE),
        dependencies: findHeader(headers, PATTERNS.DEPENDENCIES),
        progress: findHeader(headers, PATTERNS.PROGRESS),
    };

    if (!map.name) {
        throw new Error("Critical Error: No Task Name column found.");
    }

    const tasks: Task[] = rawData.map((row, index) => {
        // ID
        let id = map.id ? row[map.id]?.toString() : uuidv4();
        if (!id) id = uuidv4();

        // Name
        const name = row[map.name!]?.toString() || "Untitled Task";

        // Start Date
        let start = parseDate(map.start ? row[map.start] : null);
        if (!start) start = new Date(); // Default to today
        start.setHours(0, 0, 0, 0);

        // End Date
        let end = parseDate(map.end ? row[map.end] : null);
        if (!end) {
            // Default: Start + 1 day
            end = new Date(start);
            end.setDate(end.getDate() + 1);
        }
        end.setHours(23, 59, 59, 999);

        // Type
        const rawType = map.type ? row[map.type]?.toString().toLowerCase() : 'task';
        let type: TaskType = 'task';
        if (rawType.includes('epic')) type = 'epic';
        else if (rawType.includes('sub')) type = 'subtask';

        // Progress
        let progress = 0;
        if (map.progress) {
            const p = parseFloat(row[map.progress]);
            if (!isNaN(p)) {
                // Handle 0-1 vs 0-100 logic roughly or just assume 0-100 for now. 
                // If p <= 1 && p > 0, might be % decimal. Let's assume input is 0-100 mostly.
                progress = p > 1 ? p : p * 100;
                if (progress > 100) progress = 100;
                if (progress < 0) progress = 0;
            }
        }

        // Dependencies
        const dependencies: string[] = [];
        if (map.dependencies && row[map.dependencies]) {
            // Handle comma separated?
            const depStr = row[map.dependencies].toString();
            // Split by comma or semicolon
            const deps = depStr.split(/[,;]/).map((d: string) => d.trim()).filter((d: string) => d);
            dependencies.push(...deps);
        }

        return {
            id,
            name,
            start,
            end,
            type,
            progress: Math.round(progress),
            dependencies,
            displayOrder: index
        };
    });

    // Basic Topo Sort or Cycle breaking could happen here or in a separate pass.
    // For now, let's just return the tasks.

    return {
        meta: {
            projectTitle: fileName.split('.')[0] || "My Project",
            lastModified: new Date().toISOString(),
            version: "1.0"
        },
        tasks,
        viewSettings: {
            zoom: 'week',
            showDependencies: true,
            rowHeight: 50
        }
    };
};
