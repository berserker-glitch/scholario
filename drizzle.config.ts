import type { Config } from 'drizzle-kit';
import { join } from 'path';

/**
 * Drizzle-kit configuration for migrations
 */
export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: join(process.cwd(), 'scholario.db'),
  },
  // Only include selected tables in migrations
  tablesFilter: [
    'students',
    'subjects',
    'groups',
    'enrollments',
    'subscriptions',
    'payments',
    'settings',
    'backups',
    'audit_logs'
  ],
} satisfies Config; 