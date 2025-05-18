import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import pino from 'pino';
import * as schema from '../../db/schema';
import { loadNativeModule } from '../native-modules';
import * as Effect from 'effect/Effect';

const userDataPath = app.getPath('userData');
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

// Connection state for tracking
let dbInstance: any = null;
let connectionState = {
  connected: false,
  error: null as Error | null,
  lastCheckTime: 0
};

/**
 * Initialize the SQLite database connection
 * @returns The database instance or an error
 */
export function initializeDatabase() {
  try {
    logger.info(`Initializing database at ${dbPath}`);
    
    // Ensure the database directory exists
    if (!fs.existsSync(path.dirname(dbPath))) {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    
    logger.info(`Current working directory: ${process.cwd()}`);
    logger.info(`User data path: ${userDataPath}`);
    logger.info(`Node.js version: ${process.version}`);
    logger.info(`Electron version: ${process.versions.electron}`);
    
    // Load SQLite module
    logger.info('Loading better-sqlite3 module');
    const Database = loadNativeModule('better-sqlite3');
    
    if (!Database) {
      const error = new Error('Failed to load better-sqlite3 module');
      connectionState.error = error;
      connectionState.connected = false;
      logger.error({ err: error }, 'Database initialization failed');
      return Effect.fail(error);
    }
    
    logger.info('Creating SQLite database instance');
    let sqlite;
    
    try {
      // Check if database file exists, if not create it
      const dbExists = fs.existsSync(dbPath);
      if (!dbExists) {
        logger.info(`Database file does not exist at ${dbPath}, creating a new one`);
      }
      
      // Attempt to create the database connection
      sqlite = new Database(dbPath);
      logger.info('SQLite database instance created successfully');
    } catch (dbError: any) {
      logger.error({ err: dbError }, 'Failed to create SQLite database instance');
      connectionState.error = dbError;
      connectionState.connected = false;
      return Effect.fail(new Error(`Failed to create database connection: ${dbError.message}`));
    }
    
    try {
      // Set pragmas for better performance
      sqlite.pragma('journal_mode = WAL');
      sqlite.pragma('foreign_keys = ON');
      logger.info('SQLite pragmas set successfully');
      
      // Ensure tables exist - call this before creating Drizzle instance
      ensureTablesExist(sqlite);
      
      // Create drizzle ORM instance
      const db = drizzle(sqlite, { schema });
      logger.info('Drizzle instance created successfully');
      
      // Test the connection
      try {
        const testQuery = sqlite.prepare('SELECT 1 AS test').get();
        logger.info({ testResult: testQuery }, 'Database test query executed successfully');
        
        // Store the instance for future use
        dbInstance = db;
        connectionState.connected = true;
        connectionState.error = null;
        connectionState.lastCheckTime = Date.now();
        
        return Effect.succeed(db);
      } catch (testError: any) {
        logger.error({ err: testError }, 'Database test query failed');
        connectionState.error = testError;
        connectionState.connected = false;
        return Effect.fail(new Error(`Database connection test failed: ${testError.message}`));
      }
    } catch (pragmaError: any) {
      logger.error({ err: pragmaError }, 'Failed to set SQLite pragmas');
      connectionState.error = pragmaError;
      connectionState.connected = false;
      return Effect.fail(new Error(`Failed to set database parameters: ${pragmaError.message}`));
    }
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to initialize database');
    connectionState.error = error;
    connectionState.connected = false;
    return Effect.fail(new Error(`Database initialization failed: ${error.message}`));
  }
}

/**
 * Check the database connection status
 * @returns Connection status information
 */
export function checkDatabaseStatus() {
  try {
    // Only run a full check every 30 seconds unless we're already disconnected
    const now = Date.now();
    if (connectionState.connected && now - connectionState.lastCheckTime < 30000) {
      return Effect.succeed({ connected: true });
    }
    
    connectionState.lastCheckTime = now;
    
    if (!dbInstance) {
      logger.info('Database not initialized, attempting initialization');
      const initResult = initializeDatabase();
      
      if (Effect.isEffect(initResult)) {
        return Effect.flatMap(initResult, () => Effect.succeed({ connected: connectionState.connected }));
      }
      
      return Effect.succeed({ connected: connectionState.connected });
    }
    
    try {
      // Run a simple test query
      const sqlite = dbInstance.driver;
      
      // Check if students table exists (more thorough test)
      let tableExists = false;
      try {
        const result = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='students'").get();
        tableExists = !!result;
        if (!tableExists) {
          logger.warn('Students table not found during status check, creating tables');
          ensureTablesExist(sqlite);
        }
      } catch (e) {
        logger.warn('Failed to check for tables during status check, attempting to create tables');
        ensureTablesExist(sqlite);
      }
      
      // Run basic test query
      const result = sqlite.prepare('SELECT 1 AS test').get();
      
      if (result && result.test === 1) {
        connectionState.connected = true;
        connectionState.error = null;
        return Effect.succeed({ connected: true });
      } else {
        connectionState.connected = false;
        connectionState.error = new Error('Database test query returned unexpected result');
        return Effect.fail(connectionState.error);
      }
    } catch (error: any) {
      connectionState.connected = false;
      connectionState.error = error;
      logger.error({ err: error }, 'Database connection test failed');
      return Effect.fail(new Error(`Database connection test failed: ${error.message}`));
    }
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to check database status');
    connectionState.connected = false;
    connectionState.error = error;
    return Effect.fail(new Error(`Failed to check database connection: ${error.message}`));
  }
}

/**
 * Get the database instance, initializing if necessary
 * @returns The database instance or throws an error
 */
export function getDatabase() {
  // Return existing instance if available
  if (dbInstance && connectionState.connected) {
    return dbInstance;
  }
  
  try {
    // Try to initialize if not already initialized
    if (!dbInstance) {
      logger.info('Database instance not available, trying to initialize');
      
      // Force direct initialization instead of using Effect
      // This is more reliable in the context of IPC calls
      try {
        const Database = loadNativeModule('better-sqlite3');
        if (!Database) {
          throw new Error('Failed to load better-sqlite3 module');
        }
        
        const dbExists = fs.existsSync(dbPath);
        const sqlite = new Database(dbPath);
        if (!sqlite) {
          throw new Error('Failed to create SQLite instance');
        }
        
        sqlite.pragma('journal_mode = WAL');
        sqlite.pragma('foreign_keys = ON');
        
        // Create drizzle instance
        dbInstance = drizzle(sqlite, { schema });
        
        // Ensure all required tables exist
        ensureTablesExist(sqlite);
        
        // If this is a new database, create tables
        if (!dbExists) {
          logger.info('New database detected, schema initialized');
        }
        
        // Test the connection
        const testQuery = sqlite.prepare('SELECT 1 AS test').get();
        if (!testQuery || testQuery.test !== 1) {
          throw new Error('Database test query returned unexpected result');
        }
        
        connectionState.connected = true;
        connectionState.lastCheckTime = Date.now();
        connectionState.error = null;
        
        logger.info('Database initialized successfully through direct method');
        return dbInstance;
      } catch (initError) {
        logger.error({ err: initError }, 'Critical error creating database directly');
        connectionState.error = initError instanceof Error ? initError : new Error(String(initError));
        connectionState.connected = false;
        throw connectionState.error;
      }
    }
    
    return dbInstance;
  } catch (error) {
    logger.error({ err: error }, 'Critical error getting database instance');
    // Re-throw the error to ensure callers can handle it appropriately
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Safely close the database connection when the application exits
 */
export function closeDatabase() {
  if (dbInstance) {
    try {
      dbInstance.driver.close();
      logger.info('Database connection closed successfully');
    } catch (error) {
      logger.error({ err: error }, 'Error closing database connection');
    } finally {
      dbInstance = null;
      connectionState.connected = false;
    }
  }
}

// Auto-initialize on import
const initialDb = initializeDatabase();
if (Effect.isEffect(initialDb)) {
  Effect.runPromise(initialDb).then(db => {
    logger.info('Database initialized successfully on module load');
  }).catch(error => {
    logger.error({ err: error }, 'Initial database initialization failed');
  });
}

// Export the database instance and related functions
export { dbPath, userDataPath };

/**
 * Ensures that all required tables exist in the database
 * @param sqlite - The SQLite database instance
 */
function ensureTablesExist(sqlite: any) {
  logger.info('Ensuring all required tables exist');
  
  try {
    // Check if students table exists
    let tableExists = false;
    try {
      const result = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='students'").get();
      tableExists = !!result;
    } catch (e) {
      tableExists = false;
    }
    
    // Create tables if they don't exist (regardless of check result to be safe)
    logger.info(tableExists ? 'Students table exists, ensuring all tables' : 'Creating missing tables');
    
    // Create tables based on schema
    const studentTableSQL = `
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        parent_phone TEXT,
        parent_type TEXT,
        school TEXT,
        study_year TEXT,
        sex TEXT,
        tag TEXT,
        custom_fee REAL,
        cni TEXT,
        is_kicked INTEGER DEFAULT 0,
        created_at TEXT,
        updated_at TEXT
      )
    `;
    
    const groupsTableSQL = `
      CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        description TEXT,
        capacity INTEGER,
        day TEXT,
        hour TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `;
    
    const enrollmentsTableSQL = `
      CREATE TABLE IF NOT EXISTS enrollments (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        group_id TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        joined_at TEXT,
        left_at TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (group_id) REFERENCES groups(id)
      )
    `;
    
    const subjectsTableSQL = `
      CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        standard_fee REAL,
        color TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `;
    
    // Execute create table statements
    sqlite.exec(studentTableSQL);
    sqlite.exec(groupsTableSQL);
    sqlite.exec(subjectsTableSQL);
    sqlite.exec(enrollmentsTableSQL);
    
    logger.info('Tables created or verified successfully');
    
    return true;
  } catch (error) {
    logger.error({ err: error }, 'Failed to ensure tables exist');
    throw new Error(`Failed to ensure tables exist: ${error instanceof Error ? error.message : String(error)}`);
  }
} 