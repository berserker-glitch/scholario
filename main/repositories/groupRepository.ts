import * as Effect from '@effect/io/Effect';
import { groups, enrollments, students } from '../../db/schema';
import { BaseRepository } from './baseRepository';
import { db } from '../../db';
import { eq, and } from 'drizzle-orm';
import pino from 'pino';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Initialize logger
const logger = pino({ 
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime
}, pino.destination(path.join(logsDir, 'group-repository.log')));

/**
 * Group type definition
 */
export interface Group {
  id: string;
  subjectId: string;
  name: string;
  capacity: number;
  schedule?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Group repository with specific methods
 */
export class GroupRepository extends BaseRepository<Group> {
  constructor() {
    super(groups, logger, 'group');
  }
  
  /**
   * Gets groups by subject ID
   * @param subjectId - Subject ID
   * @returns Effect with groups for the subject
   */
  getBySubject = (subjectId: string): Effect.Effect<Group[], Error> => {
    return Effect.try({
      try: async () => {
        logger.info({ subjectId }, 'Getting groups by subject ID');
        
        const result = await db.select()
          .from(groups)
          .where(eq(groups.subjectId, subjectId))
          .all();
        
        logger.info({ subjectId, count: result.length }, 'Groups retrieved successfully');
        return result;
      },
      catch: (error) => {
        logger.error({ err: error, subjectId }, 'Failed to get groups by subject');
        return error instanceof Error ? error : new Error('Failed to get groups by subject');
      }
    });
  };
  
  /**
   * Gets students enrolled in a group
   * @param groupId - Group ID
   * @returns Effect with enrolled students
   */
  getEnrolledStudents = (groupId: string): Effect.Effect<any[], Error> => {
    return Effect.try({
      try: async () => {
        logger.info({ groupId }, 'Getting students enrolled in group');
        
        const result = await db.select({
          id: students.id,
          firstName: students.firstName,
          lastName: students.lastName,
          email: students.email,
          phone: students.phone,
          status: students.status,
          enrollmentId: enrollments.id,
          enrollmentStatus: enrollments.status,
          enrollmentDate: enrollments.enrollmentDate
        })
        .from(enrollments)
        .innerJoin(students, eq(enrollments.studentId, students.id))
        .where(and(
          eq(enrollments.groupId, groupId),
          eq(students.isKicked, false)
        ))
        .all();
        
        logger.info({ groupId, count: result.length }, 'Enrolled students retrieved successfully');
        return result;
      },
      catch: (error) => {
        logger.error({ err: error, groupId }, 'Failed to get enrolled students');
        return error instanceof Error ? error : new Error('Failed to get enrolled students');
      }
    });
  };
  
  /**
   * Enrolls a student to a group
   * @param studentId - Student ID
   * @param groupId - Group ID
   * @returns Effect with enrollment success
   */
  enrollStudent = (studentId: string, groupId: string): Effect.Effect<boolean, Error> => {
    return Effect.try({
      try: async () => {
        logger.info({ studentId, groupId }, 'Enrolling student to group');
        
        // Check if student exists and isn't kicked
        const student = await db.select()
          .from(students)
          .where(and(
            eq(students.id, studentId),
            eq(students.isKicked, false)
          ))
          .then(rows => rows[0]);
        
        if (!student) {
          logger.warn({ studentId }, 'Student not found or is kicked');
          throw new Error('Student not found or is kicked');
        }
        
        // Check if group exists
        const group = await db.select()
          .from(groups)
          .where(eq(groups.id, groupId))
          .then(rows => rows[0]);
        
        if (!group) {
          logger.warn({ groupId }, 'Group not found');
          throw new Error('Group not found');
        }
        
        // Check if enrollment already exists
        const existingEnrollment = await db.select()
          .from(enrollments)
          .where(and(
            eq(enrollments.studentId, studentId),
            eq(enrollments.groupId, groupId)
          ))
          .then(rows => rows[0]);
        
        if (existingEnrollment) {
          logger.warn({ studentId, groupId }, 'Student already enrolled in this group');
          throw new Error('Student already enrolled in this group');
        }
        
        // Check group capacity
        const enrolledCount = await db.select({ count: db.fn.count(enrollments.id) })
          .from(enrollments)
          .where(eq(enrollments.groupId, groupId))
          .then(rows => Number(rows[0]?.count || 0));
        
        if (enrolledCount >= group.capacity) {
          logger.warn({ groupId }, 'Group is at maximum capacity');
          throw new Error('Group is at maximum capacity');
        }
        
        // Create enrollment
        await db.insert(enrollments).values({
          id: generateUlid(),
          studentId,
          groupId,
          status: 'active',
          enrollmentDate: new Date().toISOString()
        });
        
        logger.info({ studentId, groupId }, 'Student enrolled successfully');
        return true;
      },
      catch: (error) => {
        logger.error({ err: error, studentId, groupId }, 'Failed to enroll student');
        return error instanceof Error ? error : new Error('Failed to enroll student');
      }
    });
  };
  
  /**
   * Moves a student from one group to another
   * @param studentId - Student ID
   * @param fromGroupId - Source group ID
   * @param toGroupId - Destination group ID
   * @returns Effect with move success
   */
  moveStudent = (studentId: string, fromGroupId: string, toGroupId: string): Effect.Effect<boolean, Error> => {
    return Effect.try({
      try: async () => {
        logger.info({ studentId, fromGroupId, toGroupId }, 'Moving student between groups');
        
        // Check if current enrollment exists
        const currentEnrollment = await db.select()
          .from(enrollments)
          .where(and(
            eq(enrollments.studentId, studentId),
            eq(enrollments.groupId, fromGroupId)
          ))
          .then(rows => rows[0]);
        
        if (!currentEnrollment) {
          logger.warn({ studentId, fromGroupId }, 'Student not enrolled in source group');
          throw new Error('Student not enrolled in source group');
        }
        
        // Check if destination group exists
        const destGroup = await db.select()
          .from(groups)
          .where(eq(groups.id, toGroupId))
          .then(rows => rows[0]);
        
        if (!destGroup) {
          logger.warn({ toGroupId }, 'Destination group not found');
          throw new Error('Destination group not found');
        }
        
        // Check if already enrolled in destination group
        const existingDestEnrollment = await db.select()
          .from(enrollments)
          .where(and(
            eq(enrollments.studentId, studentId),
            eq(enrollments.groupId, toGroupId)
          ))
          .then(rows => rows[0]);
        
        if (existingDestEnrollment) {
          logger.warn({ studentId, toGroupId }, 'Student already enrolled in destination group');
          throw new Error('Student already enrolled in destination group');
        }
        
        // Check destination group capacity
        const enrolledCount = await db.select({ count: db.fn.count(enrollments.id) })
          .from(enrollments)
          .where(eq(enrollments.groupId, toGroupId))
          .then(rows => Number(rows[0]?.count || 0));
        
        if (enrolledCount >= destGroup.capacity) {
          logger.warn({ toGroupId }, 'Destination group is at maximum capacity');
          throw new Error('Destination group is at maximum capacity');
        }
        
        // Create new enrollment
        await db.insert(enrollments).values({
          id: generateUlid(),
          studentId,
          groupId: toGroupId,
          status: 'active',
          enrollmentDate: new Date().toISOString(),
          notes: `Moved from group ${fromGroupId}`
        });
        
        // Update old enrollment
        await db.update(enrollments)
          .set({
            status: 'transferred',
            notes: `Transferred to group ${toGroupId}`
          })
          .where(and(
            eq(enrollments.studentId, studentId),
            eq(enrollments.groupId, fromGroupId)
          ));
        
        logger.info({ studentId, fromGroupId, toGroupId }, 'Student moved successfully');
        return true;
      },
      catch: (error) => {
        logger.error({ err: error, studentId, fromGroupId, toGroupId }, 'Failed to move student');
        return error instanceof Error ? error : new Error('Failed to move student');
      }
    });
  };
}

// Helper function to generate ULIDs
function generateUlid(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Create a singleton instance
export const groupRepository = new GroupRepository();

// Effect-TS service layer for the Group repository
export const GroupRepo = Effect.succeed(groupRepository); 