import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../app/App';
import './index.css';

/**
 * Declare global TypeScript interface for Electron preload API
 */
declare global {
  interface Window {
    electronAPI?: {
      getAppPath: () => Promise<string>;
      exportData: (type: string, fileName: string, data: any[]) => Promise<string>;
      generatePdf: (fileName: string, html: string) => Promise<string>;
      createBackup: (backupPath?: string) => Promise<string>;
      loadBackup: (backupPath: string) => Promise<boolean>;
      getSettings: () => Promise<Record<string, any>>;
      saveSettings: (settings: Record<string, any>) => Promise<boolean>;
    };
  }
}

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
