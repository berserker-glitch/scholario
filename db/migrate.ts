import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { join } from 'path';
import fs from 'fs';
import pino from 'pino';
import { loadNativeModule } from '../main/native-modules';
import { app } from 'electron';
import * as schema from './schema';

// Initialize logger
const logger = pino({ 
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime
}, pino.destination(join(process.cwd(), 'logs', 'migrate.log')));

// Import the db instance only when needed to avoid circular dependencies
let db;
function getDb() {
  if (!db) {
    try {
      const dbModule = require('./index');
      db = dbModule.db;
    } catch (err) {
      console.error('Failed to import db from index:', err);
      return null;
    }
  }
  return db;
}

// Alternative method that creates a direct connection to the database
// This is used if accessing through drizzle fails
function getDirectSqliteConnection() {
  try {
    // Get the user data path for the app
    const userDataPath = app.getPath('userData');
    // Store DB in userData directory
    const dbPath = join(userDataPath, 'scholario.db');
    
    console.log(`Attempting direct SQLite connection to: ${dbPath}`);
    
    // Dynamically load the better-sqlite3 module
    const Database = loadNativeModule('better-sqlite3');
    if (!Database) {
      throw new Error('Failed to load better-sqlite3 module');
    }
    
    // Create direct SQLite connection
    return new Database(dbPath);
  } catch (err) {
    console.error('Failed to create direct SQLite connection:', err);
    return null;
  }
}

/**
 * Ensures the migrations directory exists
 */
function ensureMigrationsDir() {
  const migrationsDir = join(process.cwd(), 'db', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    logger.info(`Creating migrations directory at ${migrationsDir}`);
    fs.mkdirSync(migrationsDir, { recursive: true });
  }
}

/**
 * Run migrations from the migrations directory
 */
async function runMigrations() {
  try {
    const migrationsDir = join(process.cwd(), 'db', 'migrations');
    ensureMigrationsDir();
    
    logger.info(`Running migrations from ${migrationsDir}`);
    migrate(db, { migrationsFolder: migrationsDir });
    
    logger.info('Migrations completed successfully');
  } catch (error) {
    logger.error({ err: error }, 'Failed to run migrations');
    throw error;
  }
}

/**
 * This script creates all database tables from the schema
 */
export async function migrateTables() {
  console.log('Running database migrations...');
  
  try {
    // First try to get the database through drizzle
    const drizzleDb = getDb();
    
    // Get the actual SQLite connection from the drizzle db instance
    // @ts-ignore - Access the underlying SQLite connection
    let sqlite = drizzleDb?.driver;
    
    // If drizzle connection fails, try direct connection
    if (!sqlite) {
      console.log('Drizzle db connection not available, trying direct SQLite connection');
      sqlite = getDirectSqliteConnection();
      
      if (!sqlite) {
        throw new Error('Both drizzle and direct SQLite database connection methods failed');
      }
    }
    
    console.log('SQLite connection obtained successfully');
    
    // Create students table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        parent_phone TEXT,
        parent_type TEXT,
        school TEXT,
        study_year TEXT,
        sex TEXT,
        tag TEXT,
        custom_fee INTEGER,
        cni TEXT,
        is_kicked INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created students table');
    
    // Create index on students
    sqlite.exec(`CREATE INDEX IF NOT EXISTS students_name_idx ON students(first_name, last_name)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS students_kicked_idx ON students(is_kicked)`);
    
    // Create subjects table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        fee INTEGER,
        metadata TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created subjects table');
    
    // Create index on subjects
    sqlite.exec(`CREATE INDEX IF NOT EXISTS subjects_title_idx ON subjects(title)`);
    
    // Create groups table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY NOT NULL,
        subject_id TEXT NOT NULL,
        name TEXT NOT NULL,
        capacity INTEGER NOT NULL DEFAULT 10,
        schedule TEXT,
        start_date TEXT,
        end_date TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
      )
    `);
    console.log('Created groups table');
    
    // Create index on groups
    sqlite.exec(`CREATE INDEX IF NOT EXISTS groups_subject_id_idx ON groups(subject_id)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS groups_name_idx ON groups(name)`);
    
    // Create enrollments table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id TEXT PRIMARY KEY NOT NULL,
        student_id TEXT NOT NULL,
        group_id TEXT NOT NULL,
        enrollment_date TEXT DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'active',
        notes TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (group_id) REFERENCES groups(id)
      )
    `);
    console.log('Created enrollments table');
    
    // Create index on enrollments
    sqlite.exec(`CREATE INDEX IF NOT EXISTS enrollments_student_id_idx ON enrollments(student_id)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS enrollments_group_id_idx ON enrollments(group_id)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS enrollments_student_group_idx ON enrollments(student_id, group_id)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS enrollments_status_idx ON enrollments(status)`);
    
    // Create subscriptions table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY NOT NULL,
        student_id TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        month TEXT NOT NULL,
        tag TEXT,
        amount INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
      )
    `);
    console.log('Created subscriptions table');
    
    // Create index on subscriptions
    sqlite.exec(`CREATE INDEX IF NOT EXISTS subscriptions_student_id_idx ON subscriptions(student_id)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS subscriptions_subject_id_idx ON subscriptions(subject_id)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS subscriptions_month_idx ON subscriptions(month)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status)`);
    
    // Create payments table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY NOT NULL,
        student_id TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        date TEXT NOT NULL DEFAULT CURRENT_DATE,
        override_reason TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
      )
    `);
    console.log('Created payments table');
    
    // Create index on payments
    sqlite.exec(`CREATE INDEX IF NOT EXISTS payments_student_id_idx ON payments(student_id)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS payments_subject_id_idx ON payments(subject_id)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS payments_date_idx ON payments(date)`);
    
    // Create settings table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY NOT NULL,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created settings table');
    
    // Create index on settings
    sqlite.exec(`CREATE INDEX IF NOT EXISTS settings_key_idx ON settings(key)`);
    
    // Create backups table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS backups (
        id TEXT PRIMARY KEY NOT NULL,
        path TEXT NOT NULL,
        size INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      )
    `);
    console.log('Created backups table');
    
    // Create audit logs table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY NOT NULL,
        action TEXT NOT NULL,
        entity_type TEXT,
        entity_id TEXT,
        changes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created audit_logs table');
    
    // Create index on audit logs
    sqlite.exec(`CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs(action)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS audit_logs_entity_type_idx ON audit_logs(entity_type)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS audit_logs_entity_id_idx ON audit_logs(entity_id)`);
    
    // Create users table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        access_code TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created users table');
    
    // Add a default user for initial login if users table is empty
    const userCount = sqlite.prepare('SELECT COUNT(*) as count FROM users').get();
    if (userCount && userCount.count === 0) {
      const defaultId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      sqlite.prepare(
        'INSERT INTO users (id, access_code) VALUES (?, ?)'
      ).run(defaultId, 'emp001'); // Default access code
      console.log('Created default user with access code: emp001');
    }
    
    console.log('Database migration completed successfully');
    
    return true;
  } catch (error) {
    console.error('Database migration failed:', error);
    return false;
  }
}

// Export a function to call the migration
export function ensureDatabaseSetup() {
  console.log('Checking database setup...');
  return migrateTables();
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations().then(() => {
    console.log('Migrations completed successfully');
    process.exit(0);
  }).catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
} 