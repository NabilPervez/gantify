import LZString from 'lz-string';
import type { GanttData } from '../types';

const STORAGE_KEY = 'ganttify_v1_workspace';
const MAX_STORAGE_SIZE = 4.5 * 1024 * 1024; // ~4.5MB safety margin

export const saveToLocalStorage = (data: GanttData): boolean => {
    try {
        const jsonString = JSON.stringify(data);
        const compressed = LZString.compressToUTF16(jsonString);

        // Check size roughly
        if (compressed.length * 2 > MAX_STORAGE_SIZE) {
            console.warn('Data too large for LocalStorage');
            return false;
        }

        localStorage.setItem(STORAGE_KEY, compressed);
        return true;
    } catch (error) {
        console.error('Failed to save to localStorage', error);
        return false;
    }
};

export const loadFromLocalStorage = (): GanttData | null => {
    try {
        const compressed = localStorage.getItem(STORAGE_KEY);
        if (!compressed) return null;

        const jsonString = LZString.decompressFromUTF16(compressed);
        if (!jsonString) return null;

        const data = JSON.parse(jsonString);

        // Rehydrate Dates since they come back as strings
        if (data.tasks) {
            data.tasks = data.tasks.map((task: any) => ({
                ...task,
                start: new Date(task.start),
                end: new Date(task.end)
            }));
        }

        return data as GanttData;
    } catch (error) {
        console.error('Failed to load from localStorage', error);
        return null;
    }
};

export const clearLocalStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
};
