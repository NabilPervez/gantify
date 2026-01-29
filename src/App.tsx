import React from 'react';
import { DataProvider, useData } from './context/DataContext';
import { MainDropZone } from './components/MainDropZone';
import { LayoutHeader } from './components/LayoutHeader';
import { GanttBoard } from './components/GanttView/GanttBoard';
import { ErrorBoundary } from './components/ErrorBoundary';

const AppContent: React.FC = () => {
  const { ganttData } = useData();

  if (!ganttData) {
    return <MainDropZone />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-white overflow-hidden font-sans">
      <LayoutHeader />
      <ErrorBoundary>
        <GanttBoard />
      </ErrorBoundary>
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
