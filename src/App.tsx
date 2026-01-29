import React from 'react';
import { DataProvider, useDataContext } from './context/DataContext';
import { MainDropZone } from './components/MainDropZone';
import { GanttBoard } from './components/GanttView/GanttBoard';
import { DataMapping } from './components/DataMapping';

const AppContent: React.FC = () => {
  const { appState } = useDataContext();

  return (
    <div className="h-screen w-full bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white">
      {appState === 'upload' && <MainDropZone />}
      {appState === 'mapping' && <DataMapping />}
      {appState === 'view' && <GanttBoard />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;
