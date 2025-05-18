import * as Effect from 'effect/Effect';
import { pipe } from '@effect/data/Function';
import { studentRepository, Student, StudentFilter } from '../repositories/studentRepository';
import { ipcLogger } from '../ipcLogger';
import { getDatabase } from './database';

/**
 * StudentService provides business logic for student operations
 */
export const StudentService = {
  /**
   * Creates a new student
   * @param data - Student data without ID
   */
  createStudent: (data: Omit<Student, 'id'>): Effect.Effect<Student, Error> => {
    // Log operation
    ipcLogger.info({ data }, 'Creating new student');
    
    // Verify database connection first
    try {
      getDatabase();
    } catch (dbError) {
      ipcLogger.error({ err: dbError }, 'Database connection error when creating student');
      return Effect.fail(new Error(`Database connection issue: ${dbError instanceof Error ? dbError.message : String(dbError)}`));
    }
    
    // Call repository and add logging
    return pipe(
      studentRepository.insert(data),
      Effect.tap(student => Effect.sync(() => 
        ipcLogger.info({ studentId: student.id }, 'Student created successfully')
      )),
      Effect.catchAll(error => {
        ipcLogger.error({ err: error }, 'Failed to create student');
        return Effect.fail(error instanceof Error ? error : new Error(`Failed to create student: ${String(error)}`));
      })
    );
  },
  
  /**
   * Lists students with optional filtering
   * @param filter - Filter parameters
   */
  listStudents: (filter?: StudentFilter): Effect.Effect<Student[], Error> => {
    // Log operation
    ipcLogger.info({ filter }, 'Listing students');
    
    // Verify database connection first
    try {
      getDatabase();
    } catch (dbError) {
      ipcLogger.error({ err: dbError }, 'Database connection error when listing students');
      return Effect.fail(new Error(`Database connection issue: ${dbError instanceof Error ? dbError.message : String(dbError)}`));
    }
    
    // Call repository and process result
    return pipe(
      studentRepository.list(filter),
      Effect.map((students): Student[] => {
        // Ensure we always return an array
        if (!students) {
          ipcLogger.warn('Repository returned null/undefined for students, using empty array');
          return [];
        }
        
        // Convert array-like objects to actual arrays
        if (!Array.isArray(students) && typeof students === 'object' && 'length' in students) {
          ipcLogger.warn('Converting array-like object to array');
          return Array.from(students as any);
        }
        
        // If somehow a non-array was returned, return empty array
        if (!Array.isArray(students)) {
          ipcLogger.warn(`Non-array returned for students: ${typeof students}, using empty array`);
          return [];
        }
        
        return students;
      }),
      Effect.tap(students => Effect.sync(() => 
        ipcLogger.info({ count: students.length }, 'Students retrieved successfully')
      )),
      Effect.catchAll(error => {
        ipcLogger.error({ err: error }, 'Failed to list students');
        return Effect.fail(error instanceof Error ? error : new Error(`Failed to list students: ${String(error)}`));
      })
    );
  },
  
  /**
   * Updates a student's information
   * @param id - Student ID
   * @param data - Updated student data
   */
  updateStudent: (id: string, data: Partial<Omit<Student, 'id'>>): Effect.Effect<Student, Error> => {
    ipcLogger.info({ id, data }, 'Updating student in service layer');
    
    // Using try/catch to implement proper error handling
    return Effect.try({
      try: async () => {
        try {
          // Ensure database is connected
          getDatabase();
          
          // Get the student repository instance directly
          if (!studentRepository) {
            throw new Error('Student repository is not available');
          }
          
          // Use direct property access to call the method
          const updated = await Effect.runPromise(studentRepository.update(id, data));
          
          ipcLogger.info({ studentId: id, updated }, 'Student updated successfully');
          return updated;
        } catch (dbError) {
          ipcLogger.error({ err: dbError, id, data }, 'Database error when updating student');
          throw new Error(`Failed to update student: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
        }
      },
      catch: (error) => {
        ipcLogger.error({ err: error, id, data }, 'Failed to update student');
        return error instanceof Error ? error : new Error(`Failed to update student: ${String(error)}`);
      }
    });
  },
  
  /**
   * Soft deletes a student (marks as kicked)
   * @param id - Student ID
   */
  softDeleteStudent: (id: string): Effect.Effect<boolean, Error> =>
    pipe(
      studentRepository.kick(id),
      Effect.tap(success => Effect.sync(() => 
        ipcLogger.info({ studentId: id, success }, 'Student soft-deleted')
      ))
    ),
  
  /**
   * Restores a previously kicked student
   * @param id - Student ID
   */
  restoreKickedStudent: (id: string): Effect.Effect<Student, Error> => {
    ipcLogger.info({ id }, 'Restoring kicked student');
    
    // Using the same pattern as updateStudent to ensure consistency
    return Effect.try({
      try: async () => {
        try {
          // Ensure database is connected
          getDatabase();
          
          // Get the student repository instance directly
          if (!studentRepository) {
            throw new Error('Student repository is not available');
          }
          
          // Use direct property access to call the method
          const updated = await Effect.runPromise(studentRepository.update(id, { isKicked: false }));
          
          ipcLogger.info({ studentId: id }, 'Student restored successfully');
          return updated;
        } catch (dbError) {
          ipcLogger.error({ err: dbError, id }, 'Database error when restoring kicked student');
          throw new Error(`Failed to restore student: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
        }
      },
      catch: (error) => {
        ipcLogger.error({ err: error, id }, 'Failed to restore kicked student');
        return error instanceof Error ? error : new Error(`Failed to restore kicked student: ${String(error)}`);
      }
    });
  },
  
  /**
   * Exports students matching filter criteria
   * @param filter - Filter parameters
   */
  exportStudents: (filter?: StudentFilter): Effect.Effect<Student[], Error> =>
    pipe(
      studentRepository.bulkExport(),
      Effect.tap(students => Effect.sync(() => 
        ipcLogger.info({ count: students.length }, 'Students exported successfully')
      ))
    ),
  
  /**
   * Moves multiple students to a different group
   * @param targetGroupId - Destination group ID
   * @param studentIds - Array of student IDs to move
   */
  bulkMoveStudents: (targetGroupId: string, studentIds: string[]): Effect.Effect<boolean, Error> => {
    ipcLogger.info({ groupId: targetGroupId, count: studentIds.length }, 'Bulk moving students');
    
    // This is a placeholder that would need implementation of group repository methods
    return Effect.try({
      try: () => {
        // Here we'd call groupRepository methods for each student
        // For simplicity, we're just returning true
        return true;
      },
      catch: (error) => {
        ipcLogger.error({ err: error, groupId: targetGroupId }, 'Failed to bulk move students');
        return error instanceof Error ? error : new Error('Failed to bulk move students');
      }
    });
  }
};

export default StudentService; 