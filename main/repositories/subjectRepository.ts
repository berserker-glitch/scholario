import * as Effect from 'effect/Effect';
import { subjects, groups, enrollments, students } from '../../db/schema';
import { BaseRepository } from './baseRepository';
import { db, generateUlid } from '../../db';
import { eq, and } from 'drizzle-orm';
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { getDatabase } from '../services/database';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Initialize logger
const logger = pino({ 
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime
}, pino.destination(path.join(logsDir, 'subject-repository.log')));

/**
 * Subject type definition
 */
export interface Subject {
  id: string;
  title: string;
  description?: string | null;
  fee?: number | null;
  metadata?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Subject repository with specific methods
 */
export class SubjectRepository extends BaseRepository<Subject> {
  constructor() {
    super(subjects, logger, 'subject');
  }
  
  /**
   * Gets detailed information about a subject including groups and statistics
   * @param id - Subject ID
   * @returns Effect with subject details and related information
   */
  getSubjectDetails = (id: string): Effect.Effect<any, Error> => {
    return Effect.try({
      try: async () => {
        logger.info({ subjectId: id }, 'Getting subject details');
        
        const subject = await db.select()
          .from(subjects)
          .where(eq(subjects.id, id))
          .then(rows => rows[0]);
        
        if (!subject) {
          logger.warn({ subjectId: id }, 'Subject not found');
          throw new Error('Subject not found');
        }
        
        const subjectGroups = await db.select()
          .from(groups)
          .where(eq(groups.subjectId, id))
          .all();
        
        const enrolledStudentsCount = await db.select({ count: db.fn.count() })
          .from(enrollments)
          .innerJoin(groups, eq(enrollments.groupId, groups.id))
          .where(eq(groups.subjectId, id))
          .then(result => Number(result[0]?.count || 0));
        
        const enrolledStudents = await db.select({
          id: students.id,
          firstName: students.firstName,
          lastName: students.lastName,
          phone: students.phone,
          cni: students.cni,
          school: students.school,
          studyYear: students.studyYear,
          groupId: groups.id,
          groupName: groups.name
        })
          .from(enrollments)
          .innerJoin(groups, eq(enrollments.groupId, groups.id))
          .innerJoin(students, eq(enrollments.studentId, students.id))
          .where(
            and(
              eq(groups.subjectId, id),
              eq(students.isKicked, false)
            )
          )
          .all();
        
        const detailedSubject = {
          ...subject,
          groups: subjectGroups,
          enrolledStudentsCount,
          enrolledStudents
        };
        
        logger.info({ 
          subjectId: id, 
          groupCount: subjectGroups.length, 
          studentCount: enrolledStudentsCount 
        }, 'Subject details retrieved successfully');
        
        return detailedSubject;
      },
      catch: (error) => {
        logger.error({ err: error, subjectId: id }, 'Failed to get subject details');
        return error instanceof Error ? error : new Error(`Failed to get subject details: ${String(error)}`);
      }
    });
  };
  
  /**
   * Gets students enrolled in a subject across all groups
   * @param subjectId - Subject ID
   * @returns Effect with enrolled students
   */
  getEnrolledStudents = (subjectId: string): Effect.Effect<any[], Error> => {
    return Effect.try({
      try: async () => {
        logger.info({ subjectId }, 'Getting students enrolled in subject');
        
        const result = await db.select({
          id: students.id,
          firstName: students.firstName,
          lastName: students.lastName,
          phone: students.phone,
          cni: students.cni,
          school: students.school,
          studyYear: students.studyYear,
          groupId: groups.id,
          groupName: groups.name
        })
          .from(enrollments)
          .innerJoin(groups, eq(enrollments.groupId, groups.id))
          .innerJoin(students, eq(enrollments.studentId, students.id))
          .where(
            and(
              eq(groups.subjectId, subjectId),
              eq(students.isKicked, false)
            )
          )
          .all();
        
        logger.info({ subjectId, count: result.length }, 'Enrolled students retrieved successfully');
        return result;
      },
      catch: (error) => {
        logger.error({ err: error, subjectId }, 'Failed to get enrolled students');
        return error instanceof Error ? error : new Error('Failed to get enrolled students');
      }
    });
  };
  
  /**
   * Gets all subjects with summary statistics
   * @returns Effect with subjects and their summary statistics
   */
  getSubjectsWithStats = (): Effect.Effect<any[], Error> => {
    return Effect.try({
      try: async () => {
        logger.info('Getting all subjects with stats');
        
        try {
          // Get all subjects
          const allSubjects = await db.select().from(subjects).all();
          
          // DEBUG: Log all found subjects to inspect what's coming from the database
          console.log('DEBUG - Raw subjects from database:', JSON.stringify(allSubjects, null, 2));
          logger.info({ count: allSubjects?.length || 0, rawSubjects: allSubjects }, 'Raw subjects from database');
          
          // If no subjects found, return empty array
          if (!allSubjects || allSubjects.length === 0) {
            logger.info('No subjects found, returning empty array');
            return [];
          }
          
          // For each subject, add stats with safe defaults
          const subjectsWithStats = await Promise.all(allSubjects.map(async subject => {
            try {
              // Count groups - with additional null/undefined checks
              let groupCount = 0;
              try {
                const groupResult = await db.select({ count: db.fn.count() })
                  .from(groups)
                  .where(eq(groups.subjectId, subject.id))
                  .all();
                
                // Safely extract count with fallback to 0
                groupCount = Number(groupResult?.[0]?.count || 0);
              } catch (err) {
                logger.warn({ subject: subject.id, err }, 'Failed to get group count');
              }
              
              // Count students - with additional null/undefined checks
              let studentCount = 0;
              try {
                const studentResult = await db.select({ count: db.fn.count() })
                  .from(enrollments)
                  .innerJoin(groups, eq(enrollments.groupId, groups.id))
                  .innerJoin(students, eq(enrollments.studentId, students.id))
                  .where(
                    and(
                      eq(groups.subjectId, subject.id),
                      eq(students.isKicked, false)
                    )
                  )
                  .all();
                
                // Safely extract count with fallback to 0
                studentCount = Number(studentResult?.[0]?.count || 0);
              } catch (err) {
                logger.warn({ subject: subject.id, err }, 'Failed to get student count');
              }
              
              return {
                ...subject,
                groupCount,
                studentCount
              };
            } catch (subjectError) {
              // If statistics calculation fails for a subject, return the subject with default stats
              logger.warn({ subject: subject.id, err: subjectError }, 'Failed to get stats for subject');
              return {
                ...subject,
                groupCount: 0,
                studentCount: 0
              };
            }
          }));
          
          logger.info({ count: subjectsWithStats.length }, 'Subjects with stats retrieved successfully');
          return subjectsWithStats;
        } catch (err) {
          logger.error({ err }, 'Error in getSubjectsWithStats, returning empty array');
          return []; // Return empty array on error
        }
      },
      catch: (error) => {
        logger.error({ err: error }, 'Failed to get subjects with stats');
        return error instanceof Error ? error : new Error('Failed to get subjects with stats');
      }
    });
  };
  
  /**
   * Override the base insert method to ensure consistent return format
   * @param data Subject data to insert
   * @returns Effect with the inserted subject
   */
  override insert = (data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>): Effect.Effect<Subject, Error> => {
    return Effect.try({
      try: async () => {
        const now = new Date().toISOString();
        const id = generateUlid();
        
        // Create a fully-formed subject object
        const insertData = {
          id,
          title: data.title,
          description: data.description || null,
          fee: data.fee || 0,
          metadata: data.metadata || null,
          createdAt: now,
          updatedAt: now,
        };
        
        logger.info({ insertData }, 'Inserting subject with data');
        
        // Insert into database
        await db.insert(subjects).values(insertData).run();
        
        // Verify that the subject was inserted by querying it back
        const insertedSubject = await db
          .select()
          .from(subjects)
          .where(eq(subjects.id, id))
          .then(rows => rows[0] as Subject | undefined);
          
        if (!insertedSubject) {
          logger.error({ id }, 'Subject was not found after insertion');
          throw new Error('Subject was not found after insertion');
        }
        
        logger.info({ id, insertedSubject }, 'Subject inserted successfully and verified');
        
        // Return the inserted subject with consistent format
        // Including explicit properties to ensure UI can read them
        return {
          id: insertedSubject.id,
          title: insertedSubject.title,
          description: insertedSubject.description,
          fee: insertedSubject.fee || 0,
          metadata: insertedSubject.metadata,
          createdAt: insertedSubject.createdAt,
          updatedAt: insertedSubject.updatedAt
        };
      },
      catch: (error) => {
        logger.error({ err: error, data }, 'Failed to insert subject');
        return error instanceof Error ? error : new Error('Failed to insert subject');
      }
    });
  };
}

// Create a singleton instance
export const subjectRepository = new SubjectRepository();

// Effect-TS service layer for the Subject repository
export const SubjectRepo = Effect.succeed(subjectRepository); 