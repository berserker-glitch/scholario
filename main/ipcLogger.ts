import pino from 'pino';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';

// Get user data path for logs
const userDataPath = app.getPath('userData');
const logsPath = path.join(userDataPath, 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath, { recursive: true });
}

/**
 * Centralized logger for IPC communication
 */
export const ipcLogger = pino({
  level: 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  // Redact potentially sensitive information
  redact: ['payload.code', 'payload.password', '*.password', '*.token'],
}, pino.destination(path.join(logsPath, 'ipc.log')));

/**
 * Logs IPC request details
 * @param channel - IPC channel name
 * @param payload - Request payload
 */
export function logIpcRequest(channel: string, payload: any): void {
  ipcLogger.debug({ channel, payload, direction: 'request' }, `IPC Request: ${channel}`);
}

/**
 * Logs IPC response details
 * @param channel - IPC channel name
 * @param result - Response payload
 * @param error - Error if present
 */
export function logIpcResponse(channel: string, result: any, error?: Error): void {
  if (error) {
    ipcLogger.warn(
      { channel, error: error.message, stack: error.stack, direction: 'response' },
      `IPC Error Response: ${channel}`
    );
  } else {
    ipcLogger.debug(
      { channel, success: true, direction: 'response' },
      `IPC Success Response: ${channel}`
    );
  }
} 