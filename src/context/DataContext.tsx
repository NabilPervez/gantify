import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { GanttData, Task, ViewSettings } from '../types';
import { parseFile } from '../utils/parser';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from '../utils/storage';

export type AppState = 'upload' | 'mapping' | 'view';

interface DataContextType {
    ganttData: GanttData | null;
    viewSettings: ViewSettings;
    isLoading: boolean;
    error: string | null;
    appState: AppState;
    importFile: (file: File) => Promise<void>;
    confirmMapping: () => void;
    cancelMapping: () => void;
    updateTask: (updatedTask: Task) => void;
    updateViewSettings: (settings: Partial<ViewSettings>) => void;
    resetProject: () => void;
    loadSampleData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ganttData, setGanttData] = useState<GanttData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading to check persistence
    const [error, setError] = useState<string | null>(null);
    const [appState, setAppState] = useState<AppState>('upload');

    // Hydration
    useEffect(() => {
        const init = async () => {
            // Check for embedded data (HTML Export use case)
            const embeddedScript = document.getElementById('gantt-data');
            if (embeddedScript && embeddedScript.textContent) {
                try {
                    const data = JSON.parse(embeddedScript.textContent);
                    // Rehydrate dates
                    if (data.tasks) {
                        data.tasks = data.tasks.map((task: any) => ({
                            ...task,
                            start: new Date(task.start),
                            end: new Date(task.end)
                        }));
                    }
                    setGanttData(data);
                    setAppState('view');
                    setIsLoading(false);
                    return;
                } catch (e) {
                    console.error("Failed to parse embedded data", e);
                }
            }

            // Check Local Storage
            const saved = loadFromLocalStorage();
            if (saved) {
                setGanttData(saved);
                setAppState('view');
            }
            setIsLoading(false);
        };
        init();
    }, []);

    const importFile = async (file: File) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await parseFile(file);
            setGanttData(data);
            setAppState('mapping');
            // Don't save yet? Or save as temporary?
            // For now, we set state to mapping.
        } catch (err: any) {
            setError(err.message || 'Failed to parse file');
        } finally {
            setIsLoading(false);
        }
    };

    const confirmMapping = () => {
        if (ganttData) {
            setAppState('view');
            saveToLocalStorage(ganttData);
        }
    };

    const cancelMapping = () => {
        setGanttData(null);
        setAppState('upload');
    };

    const updateTask = (updatedTask: Task) => {
        if (!ganttData) return;
        const newTasks = ganttData.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
        const newData = { ...ganttData, tasks: newTasks, meta: { ...ganttData.meta, lastModified: new Date().toISOString() } };
        setGanttData(newData);
        saveToLocalStorage(newData);
    };

    const updateViewSettings = (settings: Partial<ViewSettings>) => {
        if (!ganttData) return;
        const newData = { ...ganttData, viewSettings: { ...ganttData.viewSettings, ...settings } };
        setGanttData(newData);
        saveToLocalStorage(newData);
    };

    const resetProject = () => {
        clearLocalStorage();
        setGanttData(null);
        setAppState('upload');
    };

    const loadSampleData = async () => {
        // Mock Data
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const sample: GanttData = {
            meta: { projectTitle: "Sample Project", lastModified: new Date().toISOString(), version: "1.0" },
            tasks: [
                { id: '1', name: 'Project Kickoff', type: 'epic', start: today, end: nextWeek, progress: 100, dependencies: [], displayOrder: 0 },
                { id: '2', name: 'Requirements', type: 'task', start: today, end: new Date(today.getTime() + 86400000 * 2), progress: 50, dependencies: ['1'], displayOrder: 1 },
            ],
            viewSettings: { zoom: 'week', showDependencies: true, rowHeight: 50 }
        };
        setGanttData(sample);
        setAppState('view');
        saveToLocalStorage(sample);
    }

    const defaultViewSettings: ViewSettings = { zoom: 'day', showDependencies: true, rowHeight: 50 };
    const currentViewSettings = ganttData?.viewSettings || defaultViewSettings;

    return (
        <DataContext.Provider value={{
            ganttData,
            viewSettings: currentViewSettings,
            isLoading,
            error,
            appState,
            importFile,
            confirmMapping,
            cancelMapping,
            updateTask,
            updateViewSettings,
            resetProject,
            loadSampleData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within DataProvider");
    return context;
};
