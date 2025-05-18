import * as Effect from 'effect/Effect';
import { pipe } from '@effect/data/Function';
import { subjectRepository, Subject } from '../repositories/subjectRepository';
import { db } from '../../db';
import { subjects } from '../../db/schema';
import { ipcLogger } from '../ipcLogger';
import { eq } from 'drizzle-orm';
import { getDatabase } from './database';

/**
 * Type for subject creation data
 */
export interface SubjectCreateData {
  title: string;
  description?: string;
  fee?: number;
  metadata?: any;
}

/**
 * SubjectService provides business logic for subject operations
 */
export const SubjectService = {
  /**
   * Creates a new subject
   * @param data - Subject data without ID
   */
  createSubject: (data: SubjectCreateData): Effect.Effect<Subject, Error, never> => {
    ipcLogger.info({ data }, 'Creating subject in service layer');
    
    // Validate required fields
    if (!data.title) {
      ipcLogger.error({ data }, 'Cannot create subject: title is required');
      return Effect.fail(new Error('Title is required'));
    }
    
    // Format metadata if provided as an object
    const formattedData = {
      ...data,
      metadata: data.metadata 
        ? (typeof data.metadata === 'string' 
            ? data.metadata 
            : JSON.stringify(data.metadata))
        : null
    };
    
    ipcLogger.info({ formattedData }, 'Formatted data for subject creation');
    
    return pipe(
      subjectRepository.insert(formattedData),
      Effect.tap((subject) => Effect.sync(() => {
        // Log the returned subject for debugging
        ipcLogger.info({ 
          subjectId: subject.id, 
          subject 
        }, 'Subject created successfully with all properties');
        
        // Verify subject has expected properties
        const properties = Object.keys(subject);
        if (!properties.includes('id') || !properties.includes('title')) {
          ipcLogger.warn({ 
            subject, 
            properties 
          }, 'Created subject is missing critical properties');
        }
      })),
      // Transform the subject to ensure proper format
      Effect.map((subject) => {
        // Make sure all required properties are present
        const result = {
          id: subject.id,
          title: subject.title,
          description: subject.description || null,
          fee: subject.fee || 0,
          metadata: subject.metadata || null,
          createdAt: subject.createdAt || new Date().toISOString(),
          updatedAt: subject.updatedAt || new Date().toISOString()
        };
        
        ipcLogger.info({ 
          result 
        }, 'Transformed subject for return to UI');
        
        return result;
      }),
      Effect.catchAll((error) => {
        ipcLogger.error({ err: error, data }, 'Failed to create subject');
        return Effect.fail(error instanceof Error ? error : new Error(`Failed to create subject: ${String(error)}`));
      })
    );
  },
  
  /**
   * Lists all subjects with statistics
   */
  listSubjects: (): Effect.Effect<any[], Error, never> => {
    ipcLogger.info('Listing subjects with statistics');
    
    return pipe(
      subjectRepository.getSubjectsWithStats(),
      Effect.map((result) => {
        // Ensure result is always an array, even if repository returns a single object
        if (!result) {
          ipcLogger.warn('Received null/undefined from repository, returning empty array');
          return [];
        }
        
        if (!Array.isArray(result)) {
          ipcLogger.warn({ result }, 'Received non-array from repository, converting to array');
          return [result];
        }
        
        // Log each subject's properties for debugging
        result.forEach((subject, index) => {
          ipcLogger.info({
            index,
            id: subject.id,
            title: subject.title,
            properties: Object.keys(subject)
          }, 'Subject properties in listSubjects');
        });
        
        ipcLogger.info({ count: result.length }, 'Subjects retrieved successfully as array');
        return result;
      }),
      Effect.tap((subjectList) => Effect.sync(() => 
        ipcLogger.info({ count: subjectList.length }, 'Subjects retrieved successfully')
      )),
      Effect.catchAll((error) => {
        ipcLogger.error({ err: error }, 'Failed to list subjects, trying direct database query');
        
        // Fallback to direct database query if the getSubjectsWithStats fails
        return pipe(
          Effect.try({
            try: async () => {
              // Direct query to get subjects without stats
              const rawSubjects = await db.select().from(subjects).all();
              
              ipcLogger.info({ 
                count: rawSubjects.length, 
                subjects: rawSubjects.map(s => ({ id: s.id, title: s.title }))
              }, 'Retrieved subjects with direct query fallback');
              
              // Add default stats
              return rawSubjects.map(subject => ({
                ...subject,
                groupCount: 0,
                studentCount: 0
              }));
            },
            catch: (err) => {
              ipcLogger.error({ err }, 'Even direct query failed, returning empty array');
              return [];
            }
          }),
          Effect.catchAll((finalError) => {
            ipcLogger.error({ err: finalError }, 'All attempts to get subjects failed, returning empty array');
            return Effect.succeed([]);
          })
        );
      })
    );
  },
  
  /**
   * Gets detailed information about a subject including groups and statistics
   * @param id - Subject ID
   */
  getSubjectDetails: (id: string): Effect.Effect<any, Error, never> => {
    ipcLogger.info({ subjectId: id }, 'Getting subject details in service layer');
    
    return pipe(
      subjectRepository.getSubjectDetails(id),
      Effect.tap((subject) => Effect.sync(() => 
        ipcLogger.info({ 
          subjectId: id, 
          groupCount: subject.groups?.length || 0, 
          studentCount: subject.enrolledStudentsCount || 0 
        }, 'Subject details retrieved successfully')
      )),
      Effect.catchAll((error) => {
        ipcLogger.error({ err: error, subjectId: id }, 'Failed to get subject details');
        return Effect.fail(error instanceof Error ? error : new Error(`Failed to get subject details: ${String(error)}`));
      })
    );
  },
  
  /**
   * Updates a subject's information
   * @param id - Subject ID
   * @param data - Updated subject data
   */
  updateSubject: (id: string, data: Partial<SubjectCreateData>): Effect.Effect<Subject, Error, never> => {
    ipcLogger.info({ id, data }, 'Updating subject in service layer');
    
    // Format metadata if provided as an object
    const formattedData = {
      ...data,
      metadata: data.metadata 
        ? (typeof data.metadata === 'string' 
            ? data.metadata 
            : JSON.stringify(data.metadata))
        : undefined,
      updatedAt: new Date().toISOString()
    };
    
    return pipe(
      subjectRepository.update(id, formattedData),
      Effect.tap((subject) => Effect.sync(() => 
        ipcLogger.info({ subjectId: id }, 'Subject updated successfully')
      )),
      Effect.catchAll((error) => {
        ipcLogger.error({ err: error, id, data }, 'Failed to update subject');
        return Effect.fail(error instanceof Error ? error : new Error(`Failed to update subject: ${String(error)}`));
      })
    );
  },
  
  /**
   * Deletes a subject
   * @param id - Subject ID
   */
  deleteSubject: (id: string): Effect.Effect<boolean, Error, never> => {
    ipcLogger.info({ id }, 'Deleting subject in service layer');
    
    return pipe(
      subjectRepository.delete(id),
      Effect.tap((success) => Effect.sync(() => 
        ipcLogger.info({ subjectId: id, success }, 'Subject deleted successfully')
      )),
      Effect.catchAll((error) => {
        ipcLogger.error({ err: error, id }, 'Failed to delete subject');
        return Effect.fail(error instanceof Error ? error : new Error(`Failed to delete subject: ${String(error)}`));
      })
    );
  }
};

export default SubjectService; 