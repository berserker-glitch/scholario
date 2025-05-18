import * as Effect from 'effect/Effect';
import { students } from '../../db/schema';
import { BaseRepository } from './baseRepository';
import { db, generateUlid } from '../../db';
import { eq, like, and, or } from 'drizzle-orm';
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { getDatabase } from '../../main/services/database';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Initialize logger
const logger = pino({ 
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime
}, pino.destination(path.join(logsDir, 'student-repository.log')));

/**
 * Student type definition
 */
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  parentPhone?: string | null;
  parentType?: string | null;
  school?: string | null;
  studyYear?: string | null;
  sex?: string | null;
  tag?: string | null;
  customFee?: number | null;
  cni?: string | null;
  isKicked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Filter options for student queries
 */
export interface StudentFilter {
  search?: string;
  includeKicked?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Student repository with specific methods
 */
export class StudentRepository extends BaseRepository<Student> {
  constructor() {
    super(students, logger, 'student');
  }
  
  /**
   * Override the base insert method for students to add additional logging and validation
   * @param entity - Student data without ID
   * @returns Effect with inserted student
   */
  insert = (entity: Omit<Student, 'id'>): Effect.Effect<Student, Error> => {
    return Effect.tryPromise({
      try: async () => {
        logger.info({ data: entity }, 'Creating new student with custom insert method');
        
        try {
          // Generate a unique ID
          const id = generateUlid();
          
          // Ensure isKicked is set to false if not provided
          const insertData = { 
            id, 
            ...entity,
            isKicked: entity.isKicked !== undefined ? entity.isKicked : false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as Student;
          
          logger.info({ insertData }, 'Inserting student data');
          
          // Use direct query execution for better error control
          const query = db.insert(students).values(insertData as any);
          logger.info({ sql: query.toSQL() }, 'Generated SQL for insert');
          
          // Execute the insert
          await query.run();
          
          logger.info({ id }, 'Student created successfully, querying to verify');
          
          // Check that student was actually inserted by querying it back
          const inserted = await db.select()
            .from(students)
            .where(eq(students.id, id))
            .then(rows => rows[0] as Student | undefined);
          
          if (!inserted) {
            logger.warn({ id }, 'Student was not found after insert - possible DB issue');
            throw new Error('Student was not properly inserted into the database');
          }
          
          logger.info({ student: inserted }, 'Student insert verified successfully');
          return inserted;
        } catch (dbError) {
          logger.error({ err: dbError }, 'Database error during student creation');
          throw new Error(`Failed to create student in database: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
        }
      },
      catch: (error) => {
        logger.error({ err: error }, 'Failed to create student');
        return error instanceof Error ? error : new Error('Failed to create student');
      }
    });
  };
  
  /**
   * Soft deletes a student by setting isKicked to true
   * @param id - Student ID
   * @returns Effect with success status
   */
  kick = (id: string): Effect.Effect<boolean, Error> => {
    return Effect.tryPromise({
      try: async () => {
        logger.info({ studentId: id }, 'Soft-deleting student');
        
        // Check if student exists
        const existing = await db.select()
          .from(students)
          .where(eq(students.id, id))
          .then(rows => rows[0]);
        
        if (!existing) {
          logger.warn({ studentId: id }, 'Student not found for soft deletion');
          throw new Error('Student not found');
        }
        
        // Soft delete by setting isKicked to true
        await db.update(students)
          .set({
            isKicked: true,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(students.id, id));
        
        logger.info({ studentId: id }, 'Student soft-deleted successfully');
        return true;
      },
      catch: (error) => {
        logger.error({ err: error, studentId: id }, 'Failed to soft-delete student');
        return error instanceof Error ? error : new Error('Failed to soft-delete student');
      }
    });
  };
  
  /**
   * Lists students with filtering options
   * @param filter - Filter options
   * @returns Effect with filtered students
   */
  list = (filter: StudentFilter = {}): Effect.Effect<Student[], Error> => {
    return Effect.tryPromise({
      try: async () => {
        logger.info({ filter }, 'Getting students with filters');
        
        let query = db.select().from(students);
        
        // Apply filters
        const conditions = [];
        
        if (filter.search) {
          conditions.push(
            or(
              like(students.firstName, `%${filter.search}%`),
              like(students.lastName, `%${filter.search}%`),
              like(students.phone, `%${filter.search}%`)
            )
          );
        }
        
        if (!filter.includeKicked) {
          conditions.push(eq(students.isKicked, false));
        }
        
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
        
        // Apply pagination
        if (filter.limit) {
          query = query.limit(filter.limit);
        }
        
        if (filter.offset) {
          query = query.offset(filter.offset);
        }
        
        try {
          // Execute query
          const result = await query.all();
          
          // Ensure result is an array
          const studentsList = Array.isArray(result) ? result : [];
          
          logger.info({ 
            count: studentsList.length,
            isArray: Array.isArray(studentsList),
            resultType: typeof result,
            sampleStudent: studentsList.length > 0 ? JSON.stringify(studentsList[0]) : 'none'
          }, 'Students retrieved successfully');
          
          return studentsList;
        } catch (queryError) {
          logger.error({ err: queryError }, 'Error executing student query');
          return [];
        }
      },
      catch: (error) => {
        logger.error({ err: error }, 'Failed to get students with filters');
        return error instanceof Error ? error : new Error('Failed to get students with filters');
      }
    });
  };
  
  /**
   * Bulk export students
   * @param ids - Array of student IDs to export (or all if not provided)
   * @returns Effect with exported students
   */
  bulkExport = (ids?: string[]): Effect.Effect<Student[], Error> => {
    return Effect.tryPromise({
      try: async () => {
        try {
          if (ids && ids.length > 0) {
            logger.info({ count: ids.length }, 'Bulk exporting specific students');
            
            const exportedStudents = await db.select()
              .from(students)
              .where(({ id }) => id.in(ids))
              .all();
            
            // Ensure result is an array
            const studentsList = Array.isArray(exportedStudents) ? exportedStudents : [];
            
            logger.info({ 
              count: studentsList.length,
              isArray: Array.isArray(studentsList)
            }, 'Students exported successfully');
            
            return studentsList;
          } else {
            logger.info('Bulk exporting all students');
            
            const exportedStudents = await db.select()
              .from(students)
              .where(eq(students.isKicked, false))
              .all();
            
            // Ensure result is an array
            const studentsList = Array.isArray(exportedStudents) ? exportedStudents : [];
            
            logger.info({ 
              count: studentsList.length,
              isArray: Array.isArray(studentsList)
            }, 'Students exported successfully');
            
            return studentsList;
          }
        } catch (queryError) {
          logger.error({ err: queryError }, 'Error executing student bulk export query');
          return [];
        }
      },
      catch: (error) => {
        logger.error({ err: error }, 'Failed to bulk export students');
        return error instanceof Error ? error : new Error('Failed to bulk export students');
      }
    });
  };
  
  /**
   * Counts students with optional filters
   * @param filter - Filter options
   * @returns Effect with count
   */
  count = (filter: StudentFilter = {}): Effect.Effect<number, Error> => {
    return Effect.tryPromise({
      try: async () => {
        logger.info({ filter }, 'Counting students with filters');
        
        let query = db.select({ count: db.fn.count(students.id) }).from(students);
        
        // Apply filters
        const conditions = [];
        
        if (filter.search) {
          conditions.push(
            or(
              like(students.firstName, `%${filter.search}%`),
              like(students.lastName, `%${filter.search}%`),
              like(students.phone, `%${filter.search}%`)
            )
          );
        }
        
        if (!filter.includeKicked) {
          conditions.push(eq(students.isKicked, false));
        }
        
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
        
        // Execute query
        const result = await query.get();
        const count = Number(result?.count || 0);
        
        logger.info({ count }, 'Students counted successfully');
        return count;
      },
      catch: (error) => {
        logger.error({ err: error }, 'Failed to count students');
        return error instanceof Error ? error : new Error('Failed to count students');
      }
    });
  };
  
  /**
   * Updates a student's information with enhanced logging and validation
   * This method replaces the override version to ensure compatibility
   * @param id - Student ID
   * @param data - Fields to update
   * @returns Effect with updated student
   */
  update = (id: string, data: Partial<Omit<Student, 'id'>>): Effect.Effect<Student, Error> => {
    logger.info({ studentId: id, updateData: data }, 'Updating student with enhanced method');
    
    return Effect.tryPromise({
      try: async () => {
        try {
          // Get a database instance and ensure it's connected
          const database = getDatabase();
          
          // Check if entity exists
          const existing = await database.select()
            .from(students)
            .where(eq(students.id, id))
            .then(rows => rows[0] as Student | undefined);
          
          if (!existing) {
            logger.warn({ id }, 'Student not found for update');
            throw new Error('Student not found');
          }
          
          // Add updatedAt timestamp to ensure changes are tracked
          const updateData = {
            ...data,
            updatedAt: new Date().toISOString()
          };
          
          // Debug log the actual SQL being executed
          logger.info({ id, updateData }, 'Executing student update');
          
          // Update student directly
          await database.update(students)
            .set(updateData as any)
            .where(eq(students.id, id));
          
          // Get updated student
          const updated = await database.select()
            .from(students)
            .where(eq(students.id, id))
            .then(rows => rows[0] as Student);
          
          // Log the changes
          const changedFields: Record<string, { before: any, after: any }> = {};
          Object.keys(data).forEach(key => {
            const typedKey = key as keyof Omit<Student, 'id'>;
            if (data[typedKey] !== undefined) {
              changedFields[key] = {
                before: existing[typedKey],
                after: updated[typedKey]
              };
            }
          });
          
          logger.info({ 
            studentId: id, 
            changedFields,
            updatedAt: updated.updatedAt
          }, 'Student update verified');
          
          return updated;
        } catch (dbError) {
          // Specific error handling for database issues
          const errorMsg = `Database error when updating student: ${dbError instanceof Error ? dbError.message : String(dbError)}`;
          logger.error({ id, err: dbError, data }, errorMsg);
          throw new Error(errorMsg);
        }
      },
      catch: (error) => {
        logger.error({ err: error, studentId: id, updateData: data }, 'Failed to update student');
        return error instanceof Error ? error : new Error('Failed to update student');
      }
    });
  };
}

// Create a singleton instance
export const studentRepository = new StudentRepository();

// Effect-TS service layer for the Student repository
export const StudentRepo = Effect.succeed(studentRepository); 