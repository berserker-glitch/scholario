import * as Effect from '@effect/io/Effect';
import { pipe } from '@effect/data/Function';
import { app } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import { existsSync, createReadStream, createWriteStream } from 'fs';
import { db, generateUlid } from '../../db';
import { backups } from '../../db/schema';
import { ipcLogger } from '../ipcLogger';

/**
 * UtilityService provides utility operations like backups and exports
 */
export const UtilityService = {
  /**
   * Creates a database backup immediately
   * @returns Effect with backup info
   */
  backupNow: (): Effect.Effect<any, Error> =>
    Effect.try({
      try: async () => {
        ipcLogger.info('Creating database backup');
        
        const userDataPath = app.getPath('userData');
        const backupsDir = path.join(userDataPath, 'backups');
        
        // Ensure backups directory exists
        if (!existsSync(backupsDir)) {
          await fs.mkdir(backupsDir, { recursive: true });
        }
        
        // Generate backup filename with timestamp
        const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
        const backupFilename = `scholario-backup-${timestamp}.db`;
        const backupPath = path.join(backupsDir, backupFilename);
        
        // Get the source DB path
        const dbPath = path.join(process.cwd(), 'scholario.db');
        
        // Copy the DB file to backup location
        const sourceStream = createReadStream(dbPath);
        const destStream = createWriteStream(backupPath);
        
        await new Promise<void>((resolve, reject) => {
          sourceStream.pipe(destStream);
          sourceStream.on('error', reject);
          destStream.on('error', reject);
          destStream.on('finish', resolve);
        });
        
        // Get file size
        const stats = await fs.stat(backupPath);
        
        // Record backup in the database
        const backupId = generateUlid();
        await db.insert(backups).values({
          id: backupId,
          path: backupPath,
          size: stats.size,
          createdAt: new Date().toISOString(),
          notes: 'Automatic backup'
        });
        
        const result = {
          id: backupId,
          path: backupPath,
          size: stats.size,
          createdAt: new Date().toISOString()
        };
        
        ipcLogger.info(
          { backupId, path: backupPath, size: stats.size }, 
          'Database backup created successfully'
        );
        
        return result;
      },
      catch: (error) => {
        ipcLogger.error({ err: error }, 'Failed to create database backup');
        return error instanceof Error ? error : new Error('Failed to create database backup');
      }
    }),
  
  /**
   * Restores a database from backup
   * @param filePath - Path to backup file
   * @returns Effect with success status
   */
  restoreBackup: (filePath: string): Effect.Effect<boolean, Error> =>
    Effect.try({
      try: async () => {
        ipcLogger.info({ backupPath: filePath }, 'Restoring database from backup');
        
        // Check if backup file exists
        if (!existsSync(filePath)) {
          throw new Error('Backup file not found');
        }
        
        // Get the destination DB path
        const dbPath = path.join(process.cwd(), 'scholario.db');
        
        // Create a backup of the current DB before restoring
        const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
        const preRestoreBackup = path.join(
          app.getPath('userData'), 
          'backups', 
          `pre-restore-${timestamp}.db`
        );
        
        // Ensure backups directory exists
        const backupsDir = path.join(app.getPath('userData'), 'backups');
        if (!existsSync(backupsDir)) {
          await fs.mkdir(backupsDir, { recursive: true });
        }
        
        // Copy current DB to pre-restore backup
        if (existsSync(dbPath)) {
          const sourceStream = createReadStream(dbPath);
          const destStream = createWriteStream(preRestoreBackup);
          
          await new Promise<void>((resolve, reject) => {
            sourceStream.pipe(destStream);
            sourceStream.on('error', reject);
            destStream.on('error', reject);
            destStream.on('finish', resolve);
          });
          
          ipcLogger.info(
            { path: preRestoreBackup }, 
            'Created pre-restore backup of current database'
          );
        }
        
        // Now restore from backup file
        const backupStream = createReadStream(filePath);
        const dbStream = createWriteStream(dbPath);
        
        await new Promise<void>((resolve, reject) => {
          backupStream.pipe(dbStream);
          backupStream.on('error', reject);
          dbStream.on('error', reject);
          dbStream.on('finish', resolve);
        });
        
        ipcLogger.info({ backupPath: filePath }, 'Database restored successfully');
        return true;
      },
      catch: (error) => {
        ipcLogger.error({ err: error }, 'Failed to restore database');
        return error instanceof Error ? error : new Error('Failed to restore database');
      }
    }),
  
  /**
   * Lists all available backups
   * @returns Effect with array of backup info
   */
  listBackups: (): Effect.Effect<any[], Error> =>
    Effect.try({
      try: async () => {
        ipcLogger.info('Listing database backups');
        
        const backupRecords = await db.select().from(backups).orderBy(db.sql`${backups.createdAt} DESC`);
        
        ipcLogger.info({ count: backupRecords.length }, 'Database backups retrieved');
        return backupRecords;
      },
      catch: (error) => {
        ipcLogger.error({ err: error }, 'Failed to list database backups');
        return error instanceof Error ? error : new Error('Failed to list database backups');
      }
    }),
  
  /**
   * Exports data to CSV format
   * @param entity - Entity type to export
   * @param filter - Filter parameters
   * @returns Effect with path to exported file
   */
  exportToCSV: (entity: string, filter: any = {}): Effect.Effect<any, Error> =>
    Effect.try({
      try: async () => {
        ipcLogger.info({ entity, filter }, 'Exporting data to CSV');
        
        // This would need implementation with a CSV generation library
        // For now, we'll return a placeholder
        
        return {
          success: true,
          path: 'export.csv',
          entity,
          timestamp: new Date().toISOString()
        };
      },
      catch: (error) => {
        ipcLogger.error({ err: error, entity }, 'Failed to export to CSV');
        return error instanceof Error ? error : new Error('Failed to export to CSV');
      }
    }),
  
  /**
   * Generates an attendance PDF for a group on a specific date
   * @param groupId - Group ID
   * @param date - Date for attendance
   * @returns Effect with path to generated PDF
   */
  generateAttendancePDF: (groupId: string, date: string): Effect.Effect<any, Error> =>
    Effect.try({
      try: async () => {
        ipcLogger.info({ groupId, date }, 'Generating attendance PDF');
        
        // This would need implementation with a PDF generation library
        // For now, we'll return a placeholder
        
        return {
          success: true,
          path: 'attendance.pdf',
          groupId,
          date,
          timestamp: new Date().toISOString()
        };
      },
      catch: (error) => {
        ipcLogger.error({ err: error, groupId, date }, 'Failed to generate attendance PDF');
        return error instanceof Error ? error : new Error('Failed to generate attendance PDF');
      }
    })
};

export default UtilityService; 