import { ipcMain } from 'electron';
import { pipe } from '@effect/data/Function';
import * as Effect from 'effect/Effect';
import { effectToEither, createIpcHandler } from './types';
import { logIpcRequest, logIpcResponse } from './ipcLogger';
import AuthService from './services/authService';

// Import services
import StudentService from './services/studentService';
import GroupService from './services/groupService';
import SubjectService from './services/subjectService';
import PaymentService from './services/paymentService';
import SubscriptionService from './services/subscriptionService';
import UtilityService from './services/utilityService';
import { checkDatabaseStatus, getDatabase } from './services/database';

/**
 * Registers all IPC handlers for the application
 */
export function registerIpcHandlers(): void {
  // Database status check handler
  ipcMain.handle('db:checkStatus', async () => {
    try {
      logIpcRequest('db:checkStatus', {});
      try {
        getDatabase(); // Try to get database instance to test if it works
        logIpcResponse('db:checkStatus', { connected: true });
        return { _tag: 'Right', right: { connected: true } };
      } catch (error) {
        const errorResponse = { connected: false, error: error instanceof Error ? error.message : String(error) };
        logIpcResponse('db:checkStatus', errorResponse);
        return { _tag: 'Left', left: new Error(String(error)) };
      }
    } catch (error) {
      logIpcResponse('db:checkStatus', { connected: false, error: 'Error in database status check handler' });
      throw error;
    }
  });
  
  // Authentication handlers
  ipcMain.handle('auth:initialize', async () => {
    logIpcRequest('auth:initialize', {});
    const result = await effectToEither(AuthService.initialize());
    logIpcResponse('auth:initialize', result);
    return result;
  });
  
  ipcMain.handle('auth:validateAccessCode', async (_, code) => {
    logIpcRequest('auth:validateAccessCode', { code: '****' }); // Don't log actual code
    
    // First try database validation
    const dbResult = await effectToEither(AuthService.validateAccessCode(code));
    
    // If database validation fails or returns false, try direct default code check
    if (dbResult._tag === 'Left' || !dbResult.right) {
      console.log('Database validation failed, trying default code check');
      const defaultResult = await effectToEither(AuthService.isDefaultCode(code));
      logIpcResponse('auth:validateAccessCode', defaultResult);
      return defaultResult;
    }
    
    logIpcResponse('auth:validateAccessCode', dbResult);
    return dbResult;
  });
  
  ipcMain.handle('auth:updateAccessCode', async (_, newCode) => {
    logIpcRequest('auth:updateAccessCode', { newCode: '****' }); // Don't log actual code
    const result = await effectToEither(AuthService.updateAccessCode(newCode));
    logIpcResponse('auth:updateAccessCode', result);
    return result;
  });
  
  // Student service handlers
  ipcMain.handle('student:createStudent', async (_, data) => {
    logIpcRequest('student:createStudent', data);
    const result = await effectToEither(StudentService.createStudent(data));
    logIpcResponse('student:createStudent', result);
    return result;
  });
  
  ipcMain.handle('student:listStudents', async (_, filter) => {
    logIpcRequest('student:listStudents', filter);
    const result = await effectToEither(StudentService.listStudents(filter));
    logIpcResponse('student:listStudents', result);
    return result;
  });
  
  ipcMain.handle('student:updateStudent', async (_, id, data) => {
    try {
    logIpcRequest('student:updateStudent', { id, data });
      console.log(`[IPC] Updating student ${id} with data:`, data);
      
      // Ensure the updatedAt field is set
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      const result = await effectToEither(StudentService.updateStudent(id, updateData));
    logIpcResponse('student:updateStudent', result);
      
      // Log detailed result for debugging
      if (result._tag === 'Left') {
        console.error(`[IPC] Failed to update student ${id}:`, result.left);
      } else {
        console.log(`[IPC] Successfully updated student ${id}`);
      }
      
    return result;
    } catch (error) {
      console.error(`[IPC] Exception in student:updateStudent handler:`, error);
      return {
        _tag: 'Left',
        left: {
          message: error instanceof Error ? error.message : 'Unknown error in student:updateStudent handler',
          name: error instanceof Error ? error.name : 'Error',
          stack: error instanceof Error ? error.stack : undefined
        }
      };
    }
  });
  
  ipcMain.handle('student:softDeleteStudent', async (_, id) => {
    logIpcRequest('student:softDeleteStudent', { id });
    const result = await effectToEither(StudentService.softDeleteStudent(id));
    logIpcResponse('student:softDeleteStudent', result);
    return result;
  });
  
  ipcMain.handle('student:restoreKickedStudent', async (_, id) => {
    logIpcRequest('student:restoreKickedStudent', { id });
    const result = await effectToEither(StudentService.restoreKickedStudent(id));
    logIpcResponse('student:restoreKickedStudent', result);
    return result;
  });
  
  ipcMain.handle('student:exportStudents', async (_, filter) => {
    logIpcRequest('student:exportStudents', filter);
    const result = await effectToEither(StudentService.exportStudents(filter));
    logIpcResponse('student:exportStudents', result);
    return result;
  });
  
  ipcMain.handle('student:bulkMoveStudents', async (_, groupId, studentIds) => {
    logIpcRequest('student:bulkMoveStudents', { groupId, studentIds });
    const result = await effectToEither(StudentService.bulkMoveStudents(groupId, studentIds));
    logIpcResponse('student:bulkMoveStudents', result);
    return result;
  });
  
  // Group service handlers
  ipcMain.handle('group:createGroup', async (_, subjectId, data) => {
    logIpcRequest('group:createGroup', { subjectId, data });
    const result = await effectToEither(GroupService.createGroup(subjectId, data));
    logIpcResponse('group:createGroup', result);
    return result;
  });
  
  ipcMain.handle('group:listGroups', async (_, subjectId) => {
    logIpcRequest('group:listGroups', { subjectId });
    const result = await effectToEither(GroupService.listGroups(subjectId));
    logIpcResponse('group:listGroups', result);
    return result;
  });
  
  ipcMain.handle('group:listAllGroups', async () => {
    logIpcRequest('group:listAllGroups', {});
    const result = await effectToEither(GroupService.listAllGroups());
    logIpcResponse('group:listAllGroups', result);
    return result;
  });
  
  // SPECIAL DIRECT API for groups - emergency workaround
  ipcMain.handle('group:getDirectGroups', async () => {
    logIpcRequest('group:getDirectGroups', {});
    try {
      const { db } = await import('../db');
      const { groups } = await import('../db/schema');
      
      // Direct database query
      const allGroups = await db.select().from(groups).all();
      
      console.log(`Direct groups query found ${allGroups.length} groups`);
      console.log('First group:', allGroups.length > 0 ? JSON.stringify(allGroups[0]) : 'none');
      
      // Process groups to have consistent format
      const processedGroups = allGroups.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description || '',
        subjectId: group.subjectId,
        metadata: group.metadata,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt
      }));
      
      // Return as Right value
      const result = { _tag: 'Right', right: processedGroups };
      logIpcResponse('group:getDirectGroups', result);
      return result;
    } catch (error) {
      console.error('Direct groups query failed:', error);
      return { _tag: 'Left', left: { message: 'Failed to get groups directly' } };
    }
  });
  
  ipcMain.handle('group:getGroup', async (_, id) => {
    logIpcRequest('group:getGroup', { id });
    const result = await effectToEither(GroupService.getGroup(id));
    logIpcResponse('group:getGroup', result);
    return result;
  });
  
  ipcMain.handle('group:updateGroup', async (_, id, data) => {
    logIpcRequest('group:updateGroup', { id, data });
    const result = await effectToEither(GroupService.updateGroup(id, data));
    logIpcResponse('group:updateGroup', result);
    return result;
  });
  
  ipcMain.handle('group:reorderGroups', async (_, subjectId, newOrder) => {
    logIpcRequest('group:reorderGroups', { subjectId, newOrder });
    const result = await effectToEither(GroupService.reorderGroups(subjectId, newOrder));
    logIpcResponse('group:reorderGroups', result);
    return result;
  });
  
  ipcMain.handle('group:enrollStudentToGroup', async (_, studentId, groupId) => {
    logIpcRequest('group:enrollStudentToGroup', { studentId, groupId });
    const result = await effectToEither(GroupService.enrollStudentToGroup(studentId, groupId));
    logIpcResponse('group:enrollStudentToGroup', result);
    return result;
  });
  
  ipcMain.handle('group:moveStudentToGroup', async (_, studentId, fromGroupId, toGroupId) => {
    logIpcRequest('group:moveStudentToGroup', { studentId, fromGroupId, toGroupId });
    const result = await effectToEither(GroupService.moveStudentToGroup(studentId, fromGroupId, toGroupId));
    logIpcResponse('group:moveStudentToGroup', result);
    return result;
  });
  
  ipcMain.handle('group:removeStudentFromGroup', async (_, studentId, groupId) => {
    logIpcRequest('group:removeStudentFromGroup', { studentId, groupId });
    const result = await effectToEither(GroupService.removeStudentFromGroup(studentId, groupId));
    logIpcResponse('group:removeStudentFromGroup', result);
    return result;
  });
  
  // Group: Delete Group
  ipcMain.handle('group:deleteGroup', async (_, id) => {
    try {
      logIpcRequest('group:deleteGroup', { id });
      
      if (!id) {
        throw new Error('Group ID is required');
      }
      
      const result = await effectToEither(GroupService.deleteGroup(id));
      logIpcResponse('group:deleteGroup', result);
      return result;
    } catch (error) {
      logIpcError('group:deleteGroup', error);
      return { _tag: 'Left', left: toError(error) };
    }
  });
  
  // Subject service handlers
  ipcMain.handle('subject:createSubject', async (_, data) => {
    logIpcRequest('subject:createSubject', data);
    const result = await effectToEither(SubjectService.createSubject(data));
    logIpcResponse('subject:createSubject', result);
    return result;
  });
  
  ipcMain.handle('subject:listSubjects', async () => {
    logIpcRequest('subject:listSubjects', {});
    const result = await effectToEither(SubjectService.listSubjects());
    logIpcResponse('subject:listSubjects', result);
    return result;
  });
  
  // SPECIAL DIRECT API for subjects - emergency workaround
  ipcMain.handle('subject:getDirectSubjects', async () => {
    logIpcRequest('subject:getDirectSubjects', {});
    try {
      const { db } = await import('../db');
      const { subjects } = await import('../db/schema');
      
      // Direct database query
      const allSubjects = await db.select().from(subjects).all();
      
      console.log(`Direct subjects query found ${allSubjects.length} subjects`);
      console.log('First subject:', allSubjects.length > 0 ? JSON.stringify(allSubjects[0]) : 'none');
      
      // Process subjects to have consistent format
      const processedSubjects = allSubjects.map(subject => ({
        id: subject.id,
        title: subject.title,
        description: subject.description || '',
        fee: subject.fee || 0,
        metadata: subject.metadata,
        createdAt: subject.createdAt,
        updatedAt: subject.updatedAt,
        groupCount: 0,
        studentCount: 0
      }));
      
      // Return as Right value
      const result = { _tag: 'Right', right: processedSubjects };
      logIpcResponse('subject:getDirectSubjects', result);
      return result;
    } catch (error) {
      console.error('Direct subjects query failed:', error);
      return { _tag: 'Left', left: { message: 'Failed to get subjects directly' } };
    }
  });
  
  ipcMain.handle('subject:getSubjectDetails', async (_, id) => {
    logIpcRequest('subject:getSubjectDetails', { id });
    const result = await effectToEither(SubjectService.getSubjectDetails(id));
    logIpcResponse('subject:getSubjectDetails', result);
    return result;
  });
  
  ipcMain.handle('subject:updateSubject', async (_, id, data) => {
    logIpcRequest('subject:updateSubject', { id, data });
    const result = await effectToEither(SubjectService.updateSubject(id, data));
    logIpcResponse('subject:updateSubject', result);
    return result;
  });
  
  ipcMain.handle('subject:deleteSubject', async (_, id) => {
    logIpcRequest('subject:deleteSubject', { id });
    const result = await effectToEither(SubjectService.deleteSubject(id));
    logIpcResponse('subject:deleteSubject', result);
    return result;
  });
  
  // Payment service handlers
  ipcMain.handle('payment:createPayment', async (_, data) => {
    logIpcRequest('payment:createPayment', data);
    const result = await effectToEither(PaymentService.createPayment(data));
    logIpcResponse('payment:createPayment', result);
    return result;
  });
  
  ipcMain.handle('payment:listPaymentsByStudent', async (_, studentId) => {
    logIpcRequest('payment:listPaymentsByStudent', { studentId });
    const result = await effectToEither(PaymentService.listPaymentsByStudent(studentId));
    logIpcResponse('payment:listPaymentsByStudent', result);
    return result;
  });
  
  ipcMain.handle('payment:getPendingPayments', async (_, filter) => {
    logIpcRequest('payment:getPendingPayments', filter);
    const result = await effectToEither(PaymentService.getPendingPayments(filter));
    logIpcResponse('payment:getPendingPayments', result);
    return result;
  });
  
  ipcMain.handle('payment:getMonthlySummary', async (_, month, year) => {
    logIpcRequest('payment:getMonthlySummary', { month, year });
    const result = await effectToEither(PaymentService.getMonthlySummary(month, year));
    logIpcResponse('payment:getMonthlySummary', result);
    return result;
  });
  
  ipcMain.handle('payment:flagPartialPayment', async (_, paymentId) => {
    logIpcRequest('payment:flagPartialPayment', { paymentId });
    const result = await effectToEither(PaymentService.flagPartialPayment(paymentId));
    logIpcResponse('payment:flagPartialPayment', result);
    return result;
  });
  
  ipcMain.handle('payment:overridePaymentAmount', async (_, paymentId, newAmount, reason) => {
    logIpcRequest('payment:overridePaymentAmount', { paymentId, newAmount, reason });
    const result = await effectToEither(PaymentService.overridePaymentAmount(paymentId, newAmount, reason));
    logIpcResponse('payment:overridePaymentAmount', result);
    return result;
  });
  
  ipcMain.handle('payment:getPaymentStats', async () => {
    logIpcRequest('payment:getPaymentStats', {});
    const result = await effectToEither(PaymentService.getPaymentStats());
    logIpcResponse('payment:getPaymentStats', result);
    return result;
  });
  
  ipcMain.handle('payment:getStudentPayments', async (_, studentId) => {
    logIpcRequest('payment:getStudentPayments', { studentId });
    const result = await effectToEither(PaymentService.getStudentPayments(studentId));
    logIpcResponse('payment:getStudentPayments', result);
    return result;
  });
  
  // Subscription service handlers
  ipcMain.handle('subscription:createOrUpdateSubscription', async (_, studentId, subjectId, month, data) => {
    logIpcRequest('subscription:createOrUpdateSubscription', { studentId, subjectId, month, data });
    const result = await effectToEither(
      SubscriptionService.createOrUpdateSubscription(studentId, subjectId, month, data)
    );
    logIpcResponse('subscription:createOrUpdateSubscription', result);
    return result;
  });
  
  ipcMain.handle('subscription:listSubscriptions', async (_, filter) => {
    logIpcRequest('subscription:listSubscriptions', filter);
    const result = await effectToEither(SubscriptionService.listSubscriptions(filter));
    logIpcResponse('subscription:listSubscriptions', result);
    return result;
  });
  
  ipcMain.handle('subscription:getSubscriptionStatus', async (_, studentId, subjectId, month) => {
    logIpcRequest('subscription:getSubscriptionStatus', { studentId, subjectId, month });
    const result = await effectToEither(
      SubscriptionService.getSubscriptionStatus(studentId, subjectId, month)
    );
    logIpcResponse('subscription:getSubscriptionStatus', result);
    return result;
  });
  
  ipcMain.handle('subscription:markAsPaid', async (_, subscriptionId) => {
    logIpcRequest('subscription:markAsPaid', { subscriptionId });
    const result = await effectToEither(SubscriptionService.markAsPaid(subscriptionId));
    logIpcResponse('subscription:markAsPaid', result);
    return result;
  });
  
  ipcMain.handle('subscription:flagUnpaid', async (_, subscriptionId) => {
    logIpcRequest('subscription:flagUnpaid', { subscriptionId });
    const result = await effectToEither(SubscriptionService.flagUnpaid(subscriptionId));
    logIpcResponse('subscription:flagUnpaid', result);
    return result;
  });
  
  ipcMain.handle('subscription:generateReceipt', async (_, subscriptionId) => {
    logIpcRequest('subscription:generateReceipt', { subscriptionId });
    const result = await effectToEither(SubscriptionService.generateReceipt(subscriptionId));
    logIpcResponse('subscription:generateReceipt', result);
    return result;
  });
  
  // Utility service handlers
  ipcMain.handle('utility:backupNow', async () => {
    logIpcRequest('utility:backupNow', {});
    const result = await effectToEither(UtilityService.backupNow());
    logIpcResponse('utility:backupNow', result);
    return result;
  });
  
  ipcMain.handle('utility:restoreBackup', async (_, filePath) => {
    logIpcRequest('utility:restoreBackup', { filePath });
    const result = await effectToEither(UtilityService.restoreBackup(filePath));
    logIpcResponse('utility:restoreBackup', result);
    return result;
  });
  
  ipcMain.handle('utility:listBackups', async () => {
    logIpcRequest('utility:listBackups', {});
    const result = await effectToEither(UtilityService.listBackups());
    logIpcResponse('utility:listBackups', result);
    return result;
  });
  
  ipcMain.handle('utility:exportToCSV', async (_, entity, filter) => {
    logIpcRequest('utility:exportToCSV', { entity, filter });
    const result = await effectToEither(UtilityService.exportToCSV(entity, filter));
    logIpcResponse('utility:exportToCSV', result);
    return result;
  });
  
  ipcMain.handle('utility:generateAttendancePDF', async (_, groupId, date) => {
    logIpcRequest('utility:generateAttendancePDF', { groupId, date });
    const result = await effectToEither(UtilityService.generateAttendancePDF(groupId, date));
    logIpcResponse('utility:generateAttendancePDF', result);
    return result;
  });
} 