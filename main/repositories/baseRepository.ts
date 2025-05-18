import * as Effect from 'effect/Effect';
import { db, generateUlid } from '../../db';
import { Logger } from 'pino';
import { getDatabase } from '../../main/services/database';

/**
 * Base repository class with common CRUD operations
 */
export class BaseRepository<T extends { id: string }> {
  constructor(
    protected readonly table: any,
    protected readonly logger: Logger,
    protected readonly entityName: string
  ) {}
  
  /**
   * Inserts a new entity
   * @param entity - Entity data without ID
   * @returns Effect with inserted entity
   */
  insert = (entity: Omit<T, 'id'>): Effect.Effect<T, Error> => {
    return Effect.try({
      try: async () => {
        this.logger.info(`Creating new ${this.entityName}`);
        
        try {
          // Get a database instance and ensure it's connected
          const database = getDatabase();
          
          // Generate a unique ID if not provided
          const id = generateUlid();
          const insertData = { id, ...entity } as T;
          
          await database.insert(this.table).values(insertData as any);
          
          this.logger.info({ id }, `${this.entityName} created successfully`);
          return insertData;
        } catch (dbError) {
          // Specific error handling for database issues
          const errorMsg = `Database error when creating ${this.entityName}: ${dbError instanceof Error ? dbError.message : String(dbError)}`;
          this.logger.error({ err: dbError }, errorMsg);
          throw new Error(errorMsg);
        }
      },
      catch: (error) => {
        this.logger.error({ err: error }, `Failed to create ${this.entityName}`);
        return error instanceof Error ? error : new Error(`Failed to create ${this.entityName}`);
      }
    });
  };
  
  /**
   * Retrieves an entity by ID
   * @param id - Entity ID
   * @returns Effect with entity or error if not found
   */
  getById = (id: string): Effect.Effect<T, Error> => {
    return Effect.try({
      try: async () => {
        this.logger.info({ id }, `Getting ${this.entityName} by ID`);
        
        try {
          // Get a database instance and ensure it's connected
          const database = getDatabase();
          
          const entity = await database.select()
            .from(this.table)
            .where(({ id: entityId }) => entityId.eq(id))
            .then(rows => rows[0] as T | undefined);
          
          if (!entity) {
            this.logger.warn({ id }, `${this.entityName} not found`);
            throw new Error(`${this.entityName} not found`);
          }
          
          return entity;
        } catch (dbError) {
          // Specific error handling for database issues
          const errorMsg = `Database error when fetching ${this.entityName}: ${dbError instanceof Error ? dbError.message : String(dbError)}`;
          this.logger.error({ id, err: dbError }, errorMsg);
          throw new Error(errorMsg);
        }
      },
      catch: (error) => {
        this.logger.error({ id, err: error }, `Failed to get ${this.entityName}`);
        return error instanceof Error ? error : new Error(`Failed to get ${this.entityName}`);
      }
    });
  };
  
  /**
   * Updates an entity
   * @param id - Entity ID
   * @param data - Fields to update
   * @returns Effect with updated entity
   */
  update = (id: string, data: Partial<Omit<T, 'id'>>): Effect.Effect<T, Error> => {
    return Effect.try({
      try: async () => {
        this.logger.info({ id, data }, `Updating ${this.entityName}`);
        
        try {
          // Get a database instance and ensure it's connected
          const database = getDatabase();
          
          // Check if entity exists
          const existing = await database.select()
            .from(this.table)
            .where(({ id: entityId }) => entityId.eq(id))
            .then(rows => rows[0] as T | undefined);
          
          if (!existing) {
            this.logger.warn({ id }, `${this.entityName} not found for update`);
            throw new Error(`${this.entityName} not found`);
          }
          
          // Add updatedAt timestamp to ensure changes are tracked
          const updatedData = {
            ...data,
            updatedAt: new Date().toISOString()
          };
          
          // Debug log the actual SQL being executed
          this.logger.info({ id, updatedData }, `Executing ${this.entityName} update`);
          
          // Update entity
          await database.update(this.table)
            .set(updatedData as any)
            .where(({ id: entityId }) => entityId.eq(id));
          
          // Get updated entity
          const updated = await database.select()
            .from(this.table)
            .where(({ id: entityId }) => entityId.eq(id))
            .then(rows => rows[0] as T);
          
          this.logger.info({ id, updated }, `${this.entityName} updated successfully`);
          return updated;
        } catch (dbError) {
          // Specific error handling for database issues
          const errorMsg = `Database error when updating ${this.entityName}: ${dbError instanceof Error ? dbError.message : String(dbError)}`;
          this.logger.error({ id, err: dbError, data }, errorMsg);
          throw new Error(errorMsg);
        }
      },
      catch: (error) => {
        this.logger.error({ id, err: error, data }, `Failed to update ${this.entityName}`);
        return error instanceof Error ? error : new Error(`Failed to update ${this.entityName}`);
      }
    });
  };
  
  /**
   * Deletes an entity
   * @param id - Entity ID
   * @returns Effect with success status
   */
  delete = (id: string): Effect.Effect<boolean, Error> => {
    return Effect.try({
      try: async () => {
        this.logger.info({ id }, `Deleting ${this.entityName}`);
        
        try {
          // Get a database instance and ensure it's connected
          const database = getDatabase();
          
          // Check if entity exists
          const existing = await database.select()
            .from(this.table)
            .where(({ id: entityId }) => entityId.eq(id))
            .then(rows => rows[0] as T | undefined);
          
          if (!existing) {
            this.logger.warn({ id }, `${this.entityName} not found for deletion`);
            throw new Error(`${this.entityName} not found`);
          }
          
          // Delete entity
          await database.delete(this.table)
            .where(({ id: entityId }) => entityId.eq(id));
          
          this.logger.info({ id }, `${this.entityName} deleted successfully`);
          return true;
        } catch (dbError) {
          // Specific error handling for database issues
          const errorMsg = `Database error when deleting ${this.entityName}: ${dbError instanceof Error ? dbError.message : String(dbError)}`;
          this.logger.error({ id, err: dbError }, errorMsg);
          throw new Error(errorMsg);
        }
      },
      catch: (error) => {
        this.logger.error({ id, err: error }, `Failed to delete ${this.entityName}`);
        return error instanceof Error ? error : new Error(`Failed to delete ${this.entityName}`);
      }
    });
  };
  
  /**
   * Retrieves all entities
   * @param filter - Optional filter object
   * @returns Effect with array of entities
   */
  getAll = (filter: Partial<T> = {}): Effect.Effect<T[], Error> => {
    return Effect.try({
      try: async () => {
        this.logger.info({ filter }, `Getting all ${this.entityName}s`);
        
        try {
          // Get a database instance and ensure it's connected
          const database = getDatabase();
          
          const entities = await database.select()
            .from(this.table)
            .where(() => {
              let condition = {};
              
              // Apply filters if any
              Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                  condition = {
                    ...condition,
                    [key]: value
                  };
                }
              });
              
              return condition;
            })
            .then(rows => rows as T[]);
          
          this.logger.info({ count: entities.length }, `Retrieved ${entities.length} ${this.entityName}s`);
          return entities;
        } catch (dbError) {
          // Specific error handling for database issues
          const errorMsg = `Database error when retrieving ${this.entityName}s: ${dbError instanceof Error ? dbError.message : String(dbError)}`;
          this.logger.error({ err: dbError }, errorMsg);
          throw new Error(errorMsg);
        }
      },
      catch: (error) => {
        this.logger.error({ err: error }, `Failed to get ${this.entityName}s`);
        return error instanceof Error ? error : new Error(`Failed to get ${this.entityName}s`);
      }
    });
  };
} 