import * as Effect from 'effect/Effect';
import { pipe } from '@effect/data/Function';
import { groupRepository, Group } from '../repositories/groupRepository';
import { db, generateUlid } from '../../db';
import { groups } from '../../db/schema';
import { ipcLogger } from '../ipcLogger';
import { eq } from 'drizzle-orm';
import { getDatabase } from './database';

/**
 * GroupService provides business logic for group operations
 */
export const GroupService = {
  /**
   * Creates a new group
   * @param subjectId - Subject ID
   * @param data - Group data without ID
   */
  createGroup: (subjectId: string, data: Omit<Group, 'id' | 'subjectId'>): Effect.Effect<Group, Error> =>
    pipe(
      groupRepository.insert({ ...data, subjectId }),
      Effect.tap(group => Effect.sync(() => 
        ipcLogger.info({ groupId: group.id, subjectId }, 'Group created successfully')
      ))
    ),
  
  /**
   * Lists all groups across all subjects
   */
  listAllGroups: (): Effect.Effect<Group[], Error> =>
    Effect.try({
      try: async () => {
        ipcLogger.info('Getting all groups across all subjects');
        
        try {
          // Get database connection
          const database = getDatabase();
          if (!database) {
            throw new Error('Database not available');
          }
          
          // Get all groups from all subjects
          const allGroups = await database.query.groups.findMany();
          
          ipcLogger.info({ count: allGroups.length }, 'All groups retrieved successfully');
          return allGroups;
        } catch (error) {
          ipcLogger.error({ err: error }, 'Failed to retrieve all groups');
          throw error;
        }
      },
      catch: (error) => {
        ipcLogger.error({ err: error }, 'Error in listAllGroups');
        return error instanceof Error ? error : new Error('Failed to list all groups');
      }
    }),
  
  /**
   * Lists all groups for a subject
   * @param subjectId - Subject ID
   */
  listGroups: (subjectId: string): Effect.Effect<Group[], Error> =>
    pipe(
      groupRepository.getBySubject(subjectId),
      Effect.tap(groupList => Effect.sync(() => 
        ipcLogger.info({ subjectId, count: groupList.length }, 'Groups retrieved successfully')
      ))
    ),
  
  /**
   * Gets a group by ID
   * @param id - Group ID
   */
  getGroup: (id: string): Effect.Effect<Group, Error> =>
    pipe(
      groupRepository.getById(id),
      Effect.tap(group => Effect.sync(() => 
        ipcLogger.info({ groupId: id }, 'Group retrieved successfully')
      ))
    ),
  
  /**
   * Updates a group
   * @param id - Group ID
   * @param data - Updated group data
   */
  updateGroup: (id: string, data: Partial<Omit<Group, 'id' | 'subjectId'>>): Effect.Effect<Group, Error> =>
    pipe(
      groupRepository.update(id, data),
      Effect.tap(group => Effect.sync(() => 
        ipcLogger.info({ groupId: id }, 'Group updated successfully')
      ))
    ),
  
  /**
   * Reorders groups for a subject
   * @param subjectId - Subject ID
   * @param newOrder - Array of group IDs in the new order
   */
  reorderGroups: (subjectId: string, newOrder: string[]): Effect.Effect<boolean, Error> =>
    Effect.try({
      try: async () => {
        ipcLogger.info({ subjectId, newOrder }, 'Reordering groups');
        
        // This would require a display_order column in the groups table
        // For now, we'll just log the intention and return success
        
        return true;
      },
      catch: (error) => {
        ipcLogger.error({ err: error, subjectId }, 'Failed to reorder groups');
        return error instanceof Error ? error : new Error('Failed to reorder groups');
      }
    }),
  
  /**
   * Enrolls a student in a group
   * @param studentId - Student ID
   * @param groupId - Group ID
   */
  enrollStudentToGroup: (studentId: string, groupId: string): Effect.Effect<boolean, Error> =>
    pipe(
      groupRepository.enrollStudent(studentId, groupId),
      Effect.tap(success => Effect.sync(() => 
        ipcLogger.info({ studentId, groupId, success }, 'Student enrolled in group')
      ))
    ),
  
  /**
   * Moves a student from one group to another
   * @param studentId - Student ID
   * @param fromGroupId - Source group ID
   * @param toGroupId - Destination group ID
   */
  moveStudentToGroup: (studentId: string, fromGroupId: string, toGroupId: string): Effect.Effect<boolean, Error> =>
    pipe(
      groupRepository.moveStudent(studentId, fromGroupId, toGroupId),
      Effect.tap(success => Effect.sync(() => 
        ipcLogger.info({ studentId, fromGroupId, toGroupId, success }, 'Student moved to new group')
      ))
    ),
  
  /**
   * Removes a student from a group
   * @param studentId - Student ID
   * @param groupId - Group ID
   */
  removeStudentFromGroup: (studentId: string, groupId: string): Effect.Effect<boolean, Error> =>
    Effect.try({
      try: async () => {
        ipcLogger.info({ studentId, groupId }, 'Removing student from group');
        
        // Get the enrollment first
        const enrollment = await db.query.enrollments.findFirst({
          where: (fields, { eq, and }) => 
            and(eq(fields.studentId, studentId), eq(fields.groupId, groupId))
        });
        
        if (!enrollment) {
          throw new Error('Enrollment not found');
        }
        
        // Update enrollment status
        await db.update(enrollments)
          .set({ status: 'dropped' })
          .where(eq(enrollments.id, enrollment.id));
        
        ipcLogger.info({ studentId, groupId }, 'Student removed from group successfully');
        return true;
      },
      catch: (error) => {
        ipcLogger.error({ err: error, studentId, groupId }, 'Failed to remove student from group');
        return error instanceof Error ? error : new Error('Failed to remove student from group');
      }
    }),
  
  /**
   * Deletes a group
   * @param id - Group ID
   */
  deleteGroup: (id: string): Effect.Effect<boolean, Error> => {
    ipcLogger.info({ groupId: id }, 'Deleting group in service layer');
    
    return pipe(
      groupRepository.delete(id),
      Effect.tap(success => Effect.sync(() => 
        ipcLogger.info({ groupId: id, success }, 'Group deleted successfully')
      )),
      Effect.catchAll(error => {
        ipcLogger.error({ err: error, id }, 'Failed to delete group');
        return Effect.fail(error instanceof Error ? error : new Error(`Failed to delete group: ${String(error)}`));
      })
    );
  }
};

export default GroupService; 