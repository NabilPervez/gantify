import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { GanttData } from '../types';
import { mapRawDataToGantt } from './mapper';

// Support CSV, Excel
export const parseFile = async (file: File): Promise<GanttData> => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    let rawData: any[] = [];

    if (extension === 'csv') {
        rawData = await parseCSV(file);
    } else if (['xls', 'xlsx'].includes(extension || '')) {
        rawData = await parseExcel(file);
    } else if (extension === 'json') {
        // Allow direct JSON import of matching schema?
        const text = await file.text();
        const json = JSON.parse(text);
        if (json.tasks && json.meta) return json as GanttData; // Assume it's already in our format
        throw new Error("Invalid JSON format. Expected Ganttify Canonical JSON.");
    } else {
        throw new Error(`Unsupported file validation: ${extension}`);
    }

    return mapRawDataToGantt(rawData, file.name);
};

const parseCSV = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    console.warn("CSV Parse Errors", results.errors);
                }
                resolve(results.data);
            },
            error: (error: Error) => reject(error),
        });
    });
};

const parseExcel = async (file: File): Promise<any[]> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
};
