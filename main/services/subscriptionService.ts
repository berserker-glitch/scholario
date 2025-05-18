import * as Effect from '@effect/io/Effect';
import { pipe } from '@effect/data/Function';
import { db, generateUlid } from '../../db';
import { subscriptions } from '../../db/schema';
import { ipcLogger } from '../ipcLogger';
import { eq, and } from 'drizzle-orm';

/**
 * SubscriptionService provides business logic for subscription operations
 */
export const SubscriptionService = {
  /**
   * Creates or updates a subscription
   * @param studentId - Student ID
   * @param subjectId - Subject ID
   * @param month - Month in YYYY-MM format
   * @param data - Subscription data
   */
  createOrUpdateSubscription: (
    studentId: string, 
    subjectId: string, 
    month: string, 
    data: any
  ): Effect.Effect<any, Error> =>
    Effect.try({
      try: async () => {
        ipcLogger.info({ studentId, subjectId, month }, 'Creating/updating subscription');
        
        // Check if subscription already exists
        const existing = await db.select()
          .from(subscriptions)
          .where(and(
            eq(subscriptions.studentId, studentId),
            eq(subscriptions.subjectId, subjectId),
            eq(subscriptions.month, month)
          ))
          .then(rows => rows[0]);
        
        if (existing) {
          // Update existing subscription
          await db.update(subscriptions)
            .set({
              ...data,
              updatedAt: new Date().toISOString()
            })
            .where(eq(subscriptions.id, existing.id));
          
          const updated = await db.select()
            .from(subscriptions)
            .where(eq(subscriptions.id, existing.id))
            .then(rows => rows[0]);
          
          ipcLogger.info({ subscriptionId: existing.id }, 'Subscription updated successfully');
          return updated;
        } else {
          // Create new subscription
          const id = generateUlid();
          const subscriptionData = {
            id,
            studentId,
            subjectId,
            month,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          await db.insert(subscriptions).values(subscriptionData);
          
          ipcLogger.info({ subscriptionId: id }, 'Subscription created successfully');
          return subscriptionData;
        }
      },
      catch: (error) => {
        ipcLogger.error({ err: error, studentId, subjectId, month }, 'Failed to create/update subscription');
        return error instanceof Error ? error : new Error('Failed to create/update subscription');
      }
    }),
  
  /**
   * Lists subscriptions with optional filters
   * @param filter - Filter parameters
   */
  listSubscriptions: (filter: any = {}): Effect.Effect<any[], Error> =>
    Effect.try({
      try: async () => {
        ipcLogger.info({ filter }, 'Listing subscriptions');
        
        let query = db.select().from(subscriptions);
        
        // Apply filters
        if (filter.studentId) {
          query = query.where(eq(subscriptions.studentId, filter.studentId));
        }
        
        if (filter.subjectId) {
          query = query.where(eq(subscriptions.subjectId, filter.subjectId));
        }
        
        if (filter.month) {
          query = query.where(eq(subscriptions.month, filter.month));
        }
        
        if (filter.status) {
          query = query.where(eq(subscriptions.status, filter.status));
        }
        
        // Execute query
        const results = await query.all();
        
        ipcLogger.info({ count: results.length }, 'Subscriptions retrieved successfully');
        return results;
      },
      catch: (error) => {
        ipcLogger.error({ err: error }, 'Failed to list subscriptions');
        return error instanceof Error ? error : new Error('Failed to list subscriptions');
      }
    }),
  
  /**
   * Gets subscription status for a student, subject, and month
   * @param studentId - Student ID
   * @param subjectId - Subject ID
   * @param month - Month in YYYY-MM format
   */
  getSubscriptionStatus: (
    studentId: string, 
    subjectId: string, 
    month: string
  ): Effect.Effect<any, Error> =>
    Effect.try({
      try: async () => {
        ipcLogger.info({ studentId, subjectId, month }, 'Getting subscription status');
        
        const subscription = await db.select()
          .from(subscriptions)
          .where(and(
            eq(subscriptions.studentId, studentId),
            eq(subscriptions.subjectId, subjectId),
            eq(subscriptions.month, month)
          ))
          .then(rows => rows[0]);
        
        if (!subscription) {
          ipcLogger.info({ studentId, subjectId, month }, 'No subscription found');
          return { exists: false };
        }
        
        ipcLogger.info(
          { subscriptionId: subscription.id, status: subscription.status }, 
          'Subscription status retrieved'
        );
        
        return {
          exists: true,
          subscription
        };
      },
      catch: (error) => {
        ipcLogger.error({ err: error, studentId, subjectId, month }, 'Failed to get subscription status');
        return error instanceof Error ? error : new Error('Failed to get subscription status');
      }
    }),
  
  /**
   * Marks a subscription as paid
   * @param subscriptionId - Subscription ID
   */
  markAsPaid: (subscriptionId: string): Effect.Effect<any, Error> =>
    Effect.try({
      try: async () => {
        ipcLogger.info({ subscriptionId }, 'Marking subscription as paid');
        
        const subscription = await db.select()
          .from(subscriptions)
          .where(eq(subscriptions.id, subscriptionId))
          .then(rows => rows[0]);
        
        if (!subscription) {
          throw new Error('Subscription not found');
        }
        
        await db.update(subscriptions)
          .set({
            status: 'paid',
            updatedAt: new Date().toISOString()
          })
          .where(eq(subscriptions.id, subscriptionId));
        
        const updated = await db.select()
          .from(subscriptions)
          .where(eq(subscriptions.id, subscriptionId))
          .then(rows => rows[0]);
        
        ipcLogger.info({ subscriptionId }, 'Subscription marked as paid');
        return updated;
      },
      catch: (error) => {
        ipcLogger.error({ err: error, subscriptionId }, 'Failed to mark subscription as paid');
        return error instanceof Error ? error : new Error('Failed to mark subscription as paid');
      }
    }),
  
  /**
   * Flags a subscription as unpaid
   * @param subscriptionId - Subscription ID
   */
  flagUnpaid: (subscriptionId: string): Effect.Effect<any, Error> =>
    Effect.try({
      try: async () => {
        ipcLogger.info({ subscriptionId }, 'Flagging subscription as unpaid');
        
        const subscription = await db.select()
          .from(subscriptions)
          .where(eq(subscriptions.id, subscriptionId))
          .then(rows => rows[0]);
        
        if (!subscription) {
          throw new Error('Subscription not found');
        }
        
        await db.update(subscriptions)
          .set({
            status: 'overdue',
            updatedAt: new Date().toISOString()
          })
          .where(eq(subscriptions.id, subscriptionId));
        
        const updated = await db.select()
          .from(subscriptions)
          .where(eq(subscriptions.id, subscriptionId))
          .then(rows => rows[0]);
        
        ipcLogger.info({ subscriptionId }, 'Subscription flagged as unpaid');
        return updated;
      },
      catch: (error) => {
        ipcLogger.error({ err: error, subscriptionId }, 'Failed to flag subscription as unpaid');
        return error instanceof Error ? error : new Error('Failed to flag subscription as unpaid');
      }
    }),
  
  /**
   * Generates a receipt for a subscription
   * @param subscriptionId - Subscription ID
   */
  generateReceipt: (subscriptionId: string): Effect.Effect<any, Error> =>
    Effect.try({
      try: async () => {
        ipcLogger.info({ subscriptionId }, 'Generating receipt for subscription');
        
        // Get subscription data
        const subscription = await db.select()
          .from(subscriptions)
          .where(eq(subscriptions.id, subscriptionId))
          .then(rows => rows[0]);
        
        if (!subscription) {
          throw new Error('Subscription not found');
        }
        
        // Get student data
        const student = await db.query.students.findFirst({
          where: eq(db.students.id, subscription.studentId)
        });
        
        if (!student) {
          throw new Error('Student not found');
        }
        
        // Get subject data
        const subject = await db.query.subjects.findFirst({
          where: eq(db.subjects.id, subscription.subjectId)
        });
        
        if (!subject) {
          throw new Error('Subject not found');
        }
        
        // Generate receipt data
        const receipt = {
          receiptId: `R-${Date.now()}`,
          date: new Date().toISOString(),
          subscription,
          student: {
            id: student.id,
            name: `${student.firstName} ${student.lastName}`,
            email: student.email
          },
          subject: {
            id: subject.id,
            name: subject.title
          },
          amount: subscription.amount,
          status: subscription.status,
          month: subscription.month
        };
        
        ipcLogger.info({ subscriptionId, receiptId: receipt.receiptId }, 'Receipt generated successfully');
        return receipt;
      },
      catch: (error) => {
        ipcLogger.error({ err: error, subscriptionId }, 'Failed to generate receipt');
        return error instanceof Error ? error : new Error('Failed to generate receipt');
      }
    })
};

export default SubscriptionService; 