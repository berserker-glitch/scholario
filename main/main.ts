import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import pino from 'pino';
import fs from 'fs';
import { URL } from 'url';
import { registerIpcHandlers } from './ipcHandlers';
import AuthService from './services/authService';
import { initializeDatabase, closeDatabase } from './services/database';
import { Effect } from 'effect';

// Check if running in development mode
const isDev = process.env.NODE_ENV === 'development';

// In development mode, we're using ts-node so __dirname isn't the compiled location
const getFilePathForEnv = (relativePath: string): string => {
  if (isDev) {
    return path.join(process.cwd(), relativePath);
  } else {
    return path.join(__dirname, relativePath);
  }
};

// Get user data path
const userDataPath = app.getPath('userData');
const logsPath = path.join(userDataPath, 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath, { recursive: true });
}

// Initialize logger
const logger = pino({ 
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime
}, pino.destination(path.join(logsPath, 'app.log')));

logger.info(`Application starting in ${isDev ? 'development' : 'production'} mode`);
logger.info(`User data path: ${userDataPath}`);
logger.info(`Current working directory: ${process.cwd()}`);

// Keep a global reference of the window object to avoid garbage collection
let mainWindow: BrowserWindow | null = null;

/**
 * Creates the main application window
 */
function createWindow() {
  logger.info('Creating main window');
  
  // Determine the correct preload path
  const preloadPath = isDev 
    ? path.join(process.cwd(), 'preload.js') 
    : path.join(__dirname, '../preload.js');
  
  logger.info(`Using preload script: ${preloadPath}`);
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // In development mode, load from the vite dev server
  // In production, load the bundled index.html
  if (isDev) {
    const devServerUrl = 'http://localhost:5173';
    logger.info(`Loading app from dev server: ${devServerUrl}`);
    mainWindow.loadURL(devServerUrl);
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the bundled index.html
    const indexPath = getFilePathForEnv('../dist/index.html');
    logger.info(`Loading app from file: ${indexPath}`);
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    logger.info('Main window closed');
    mainWindow = null;
  });

  logger.info('Main window created successfully');
}

// Register IPC handlers
registerIpcHandlers();

// Create window when Electron has finished initializing
app.whenReady().then(async () => {
  // Initialize database
  try {
    logger.info('Initializing database service');
    // Use direct database initialization instead of Effect
    const dbInstance = getDatabase();
    logger.info('Database initialized successfully', { database: !!dbInstance });
  } catch (dbError) {
    logger.error({ err: dbError }, 'Critical error initializing database');
    // Don't exit - allow app to run in degraded mode
  }
  
  // Initialize authentication service
  try {
    await AuthService.initialize();
    logger.info('Authentication service initialized successfully');
  } catch (error) {
    logger.error({ err: error }, 'Failed to initialize authentication service');
  }
  
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
  });
}).catch(err => {
  logger.error({ err }, 'Failed to initialize application');
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  logger.info('All windows closed');
  if (process.platform !== 'darwin') {
    logger.info('Quitting application');
    app.quit();
  }
});

// Clean up resources when app is about to exit
app.on('will-quit', () => {
  logger.info('Application is about to exit, cleaning up resources');
  closeDatabase();
});

// Handle IPC events here
ipcMain.handle('get-app-path', () => {
  logger.info('IPC: Requested app path');
  return app.getPath('userData');
});

process.on('uncaughtException', (error) => {
  logger.error({ err: error }, 'Uncaught exception');
});

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled rejection');
}); 