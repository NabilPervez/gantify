
export type TaskType = 'epic' | 'task' | 'subtask';

export interface Task {
    id: string;
    name: string;
    start: Date;
    end: Date;
    type: TaskType;
    progress: number;
    dependencies: string[];
    displayOrder: number;
}

export interface ProjectMeta {
    projectTitle: string;
    lastModified: string; // ISO-8601
    version: string;
}

export interface ViewSettings {
    zoom: 'day' | 'week' | 'month';
    showDependencies: boolean;
    rowHeight: number;
}

export interface GanttData {
    meta: ProjectMeta;
    tasks: Task[];
    viewSettings: ViewSettings;
}

export interface MappingResult {
    data: GanttData;
    errors?: string[];
    warnings?: string[];
}
