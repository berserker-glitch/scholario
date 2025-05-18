import * as Effect from '@effect/io/Effect';
import { pipe } from '@effect/data/Function';
import { db, generateUlid } from '../../db';
import { users, settings } from '../../db/schema';
import { eq } from 'drizzle-orm';
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';

// Initialize logger
const logsDir = path.join(app.getPath('userData'), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logger = pino({ 
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime
}, pino.destination(path.join(logsDir, 'auth-service.log')));

// Default access code for initial setup
const DEFAULT_ACCESS_CODE = 'emp001';

/**
 * AuthService provides authentication logic
 */
export const AuthService = {
  /**
   * Initialize authentication - creates default user if none exists
   */
  initialize: (): Effect.Effect<never, Error, boolean> =>
    Effect.try({
      try: async () => {
        logger.info('Initializing authentication service');
        
        // Check if any user exists
        const existingUser = await db.select()
          .from(users)
          .limit(1)
          .then(rows => rows[0]);
        
        // If no user exists, create default one
        if (!existingUser) {
          logger.info('No users found, creating default user');
          await db.insert(users).values({
            id: generateUlid(),
            accessCode: DEFAULT_ACCESS_CODE,
          });
          logger.info('Default user created successfully');
        } else {
          logger.info('Existing user found, skipping default user creation');
        }
        
        return true;
      },
      catch: (error) => {
        logger.error({ err: error }, 'Failed to initialize authentication service');
        return error instanceof Error ? error : new Error('Failed to initialize authentication');
      }
    }),
  
  /**
   * Validates an access code
   * @param code - The access code to validate
   */
  validateAccessCode: (code: string): Effect.Effect<never, Error, boolean> =>
    Effect.try({
      try: async () => {
        logger.info('Validating access code');
        
        // Find user with matching access code
        const user = await db.select()
          .from(users)
          .where(eq(users.accessCode, code))
          .then(rows => rows[0]);
        
        const isValid = !!user;
        logger.info({ isValid, code }, 'Access code validation result');
        
        return isValid;
      },
      catch: (error) => {
        logger.error({ err: error }, 'Failed to validate access code');
        return error instanceof Error ? error : new Error('Failed to validate access code');
      }
    }),
  
  /**
   * Updates the access code
   * @param newCode - The new access code
   */
  updateAccessCode: (newCode: string): Effect.Effect<never, Error, boolean> =>
    Effect.try({
      try: async () => {
        logger.info('Updating access code');
        
        // Get the first user (we only have one)
        const existingUser = await db.select()
          .from(users)
          .limit(1)
          .then(rows => rows[0]);
        
        if (!existingUser) {
          logger.warn('No user found when updating access code');
          throw new Error('No user found');
        }
        
        // Update the access code
        await db.update(users)
          .set({ 
            accessCode: newCode,
            updatedAt: new Date().toISOString()
          })
          .where(eq(users.id, existingUser.id));
        
        logger.info('Access code updated successfully');
        return true;
      },
      catch: (error) => {
        logger.error({ err: error }, 'Failed to update access code');
        return error instanceof Error ? error : new Error('Failed to update access code');
      }
    }),
    
  /**
   * Directly checks if the provided code is the default access code
   * This is a fallback method in case the database validation fails
   */
  isDefaultCode: (code: string): Effect.Effect<never, Error, boolean> =>
    Effect.succeed(code === DEFAULT_ACCESS_CODE)
};

export default AuthService; 