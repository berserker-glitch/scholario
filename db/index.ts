import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import * as schema from './schema';
import pino from 'pino';
import { loadNativeModule } from '../main/native-modules';

// Get the user data path for the app
const userDataPath = app.getPath('userData');
// Store DB in userData directory instead of cwd for better reliability
const dbPath = path.join(userDataPath, 'scholario.db');
const logsPath = path.join(userDataPath, 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath, { recursive: true });
}

// Initialize logger
const logger = pino({ 
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime
}, pino.destination(path.join(logsPath, 'db.log')));

/**
 * Initialize the SQLite database with Drizzle ORM
 * @returns {Object} Drizzle DB instance
 */
export function initializeDatabase() {
  try {
    logger.info(`Initializing database at ${dbPath}`);
    
    // Ensure the database directory exists
    if (!fs.existsSync(path.dirname(dbPath))) {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    
    // Debug information
    logger.info(`Current working directory: ${process.cwd()}`);
    logger.info(`User data path: ${userDataPath}`);
    logger.info(`Node.js version: ${process.version}`);
    logger.info(`Electron version: ${process.versions.electron}`);
    
    // Dynamically load the better-sqlite3 module
    logger.info('Loading better-sqlite3 module');
    const Database = loadNativeModule('better-sqlite3');
    
    if (!Database) {
      throw new Error('Failed to load better-sqlite3 module');
    }
    
    logger.info('Creating SQLite database instance');
    let sqlite;
    
    try {
      sqlite = new Database(dbPath);
      logger.info('SQLite database instance created successfully');
    } catch (dbError) {
      logger.error({ err: dbError }, 'Failed to create SQLite database instance');
      
      // Try with in-memory database as fallback
      logger.info('Trying in-memory database as fallback');
      sqlite = new Database(':memory:');
      logger.info('In-memory SQLite database instance created successfully');
    }
    
    // Enable foreign keys
    try {
      sqlite.pragma('journal_mode = WAL');
      sqlite.pragma('foreign_keys = ON');
      logger.info('SQLite pragmas set successfully');
    } catch (pragmaError) {
      logger.error({ err: pragmaError }, 'Failed to set SQLite pragmas');
    }
    
    // Create the Drizzle instance with schema
    const db = drizzle(sqlite, { schema });
    logger.info('Drizzle instance created successfully');
    
    // Test the database connection
    try {
      const testQuery = sqlite.prepare('SELECT 1 AS test').get();
      logger.info({ testResult: testQuery }, 'Database test query executed successfully');
    } catch (testError) {
      logger.error({ err: testError }, 'Database test query failed');
    }
    
    logger.info('Database initialized successfully');
    return db;
  } catch (error) {
    logger.error({ err: error }, 'Failed to initialize database');
    throw error;
  }
}

// Export the initialized database instance
export const db = initializeDatabase();

// Import the migrate function here to avoid circular dependencies
// Run migrations to ensure database schema exists
let ensureDatabaseSetup;
try {
  // We need to use dynamic import here to avoid circular dependencies
  const migrate = require('./migrate');
  ensureDatabaseSetup = migrate.ensureDatabaseSetup;
  
  // Call this immediately to ensure tables are created
  try {
    ensureDatabaseSetup()
      .then(success => {
        if (success) {
          logger.info('Database tables created successfully');
        } else {
          logger.error('Failed to create database tables');
        }
      })
      .catch(error => {
        logger.error({ err: error }, 'Error during database setup');
      });
  } catch (error) {
    logger.error({ err: error }, 'Critical error during database setup');
  }
} catch (err) {
  logger.error({ err }, 'Failed to load migration module');
}

/**
 * Creates a backup of the database
 * @param {string} backupPath - Optional custom path for backup
 * @returns {string} Path to the created backup file
 */
export function createBackup(backupPath?: string) {
  try {
    // Generate backup filename with timestamp if not provided
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultBackupDir = path.join(userDataPath, 'backups');
    
    if (!fs.existsSync(defaultBackupDir)) {
      fs.mkdirSync(defaultBackupDir, { recursive: true });
    }
    
    const targetPath = backupPath || path.join(defaultBackupDir, `backup-${timestamp}.db`);
    
    logger.info(`Creating database backup at ${targetPath}`);
    
    // Dynamically load the better-sqlite3 module
    const Database = loadNativeModule('better-sqlite3');
    
    // Create backup using SQLite backup API
    const sqlite = new Database(dbPath);
    fs.copyFileSync(dbPath, targetPath);
    sqlite.close();
    
    // Record backup in the backups table
    const fileStats = fs.statSync(targetPath);
    
    // Generate ULID for the backup
    const ulid = generateUlid();
    
    // Insert backup record
    db.insert(schema.backups).values({
      id: ulid,
      path: targetPath,
      size: fileStats.size,
      notes: `Automatic backup created on ${new Date().toLocaleString()}`
    }).run();
    
    logger.info(`Backup created successfully at ${targetPath}`);
    return targetPath;
  } catch (error) {
    logger.error({ err: error }, 'Failed to create database backup');
    throw error;
  }
}

/**
 * Restores the database from a backup
 * @param {string} backupPath - Path to the backup file
 * @returns {boolean} Success status
 */
export function restoreBackup(backupPath: string) {
  try {
    if (!fs.existsSync(backupPath)) {
      logger.error(`Backup file not found: ${backupPath}`);
      return false;
    }
    
    logger.info(`Restoring database from backup ${backupPath}`);
    
    // Dynamically load the better-sqlite3 module
    const Database = loadNativeModule('better-sqlite3');
    
    // Close current database connection
    const sqlite = new Database(dbPath);
    sqlite.close();
    
    // Create a backup of the current database before restoring
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const currentBackup = path.join(userDataPath, 'backups', `pre-restore-${timestamp}.db`);
    
    if (!fs.existsSync(path.dirname(currentBackup))) {
      fs.mkdirSync(path.dirname(currentBackup), { recursive: true });
    }
    
    // Copy current database to backup location
    fs.copyFileSync(dbPath, currentBackup);
    
    // Copy backup file to database location
    fs.copyFileSync(backupPath, dbPath);
    
    // Reinitialize database
    initializeDatabase();
    
    logger.info(`Database restored successfully from ${backupPath}`);
    return true;
  } catch (error) {
    logger.error({ err: error }, 'Failed to restore database from backup');
    return false;
  }
}

/**
 * Generates a ULID (Universally Unique Lexicographically Sortable Identifier)
 * Simple implementation - in production, use a proper ULID library
 * @returns {string} ULID string
 */
export function generateUlid(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}${randomPart}`.toUpperCase();
} 