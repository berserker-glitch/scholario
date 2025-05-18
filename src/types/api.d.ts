/**
 * Type definitions for IPC API methods exposed by the Electron main process
 */

interface EitherResult<T> {
  _tag: 'Right' | 'Left';
  left?: Error;
  right?: T;
}

// Student API types
interface StudentApi {
  createStudent: (data: any) => Promise<EitherResult<any>>;
  listStudents: (filter?: any) => Promise<EitherResult<any[]>>;
  updateStudent: (id: string, data: any) => Promise<EitherResult<any>>;
  softDeleteStudent: (id: string) => Promise<EitherResult<boolean>>;
  restoreKickedStudent: (id: string) => Promise<EitherResult<any>>;
  exportStudents: (filter?: any) => Promise<EitherResult<any[]>>;
  bulkMoveStudents: (groupId: string, studentIds: string[]) => Promise<EitherResult<boolean>>;
}

// Group API types
interface GroupApi {
  createGroup: (subjectId: string, data: any) => Promise<EitherResult<any>>;
  listGroups: (subjectId: string) => Promise<EitherResult<any[]>>;
  listAllGroups: () => Promise<EitherResult<any[]>>;
  getGroup: (id: string) => Promise<EitherResult<any>>;
  updateGroup: (id: string, data: any) => Promise<EitherResult<any>>;
  reorderGroups: (subjectId: string, newOrder: string[]) => Promise<EitherResult<boolean>>;
  enrollStudentToGroup: (studentId: string, groupId: string) => Promise<EitherResult<boolean>>;
  moveStudentToGroup: (studentId: string, fromGroupId: string, toGroupId: string) => Promise<EitherResult<boolean>>;
  removeStudentFromGroup: (studentId: string, groupId: string) => Promise<EitherResult<boolean>>;
}

// Subject API types
interface SubjectApi {
  createSubject: (data: any) => Promise<EitherResult<any>>;
  listSubjects: () => Promise<EitherResult<any[]>>;
  getSubjectDetails: (id: string) => Promise<EitherResult<any>>;
  updateSubject: (id: string, data: any) => Promise<EitherResult<any>>;
  deleteSubject: (id: string) => Promise<EitherResult<boolean>>;
}

// Payment API types
interface PaymentApi {
  createPayment: (data: any) => Promise<EitherResult<any>>;
  listPaymentsByStudent: (studentId: string) => Promise<EitherResult<any[]>>;
  getStudentPayments: (studentId: string) => Promise<EitherResult<any[]>>;
  getPendingPayments: (filter?: any) => Promise<EitherResult<any[]>>;
  getMonthlySummary: (month: number, year: number) => Promise<EitherResult<any>>;
  flagPartialPayment: (paymentId: string) => Promise<EitherResult<any>>;
  overridePaymentAmount: (paymentId: string, newAmount: number, reason: string) => Promise<EitherResult<any>>;
  getPaymentStats: () => Promise<EitherResult<{
    monthlyRevenue: number;
    pendingPayments: number;
    collectionRate: number;
  }>>;
}

// Subscription API types
interface SubscriptionApi {
  createOrUpdateSubscription: (
    studentId: string, 
    subjectId: string,
    month: string,
    data: any
  ) => Promise<EitherResult<any>>;
  listSubscriptions: (filter?: any) => Promise<EitherResult<any[]>>;
  getSubscriptionStatus: (
    studentId: string, 
    subjectId: string, 
    month: string
  ) => Promise<EitherResult<any>>;
  markAsPaid: (subscriptionId: string) => Promise<EitherResult<any>>;
  flagUnpaid: (subscriptionId: string) => Promise<EitherResult<any>>;
  generateReceipt: (subscriptionId: string) => Promise<EitherResult<any>>;
}

// Utility API types
interface UtilityApi {
  backupNow: () => Promise<EitherResult<any>>;
  restoreBackup: (filePath: string) => Promise<EitherResult<boolean>>;
  listBackups: () => Promise<EitherResult<any[]>>;
  exportToCSV: (entity: string, filter?: any) => Promise<EitherResult<any>>;
  generateAttendancePDF: (groupId: string, date: string) => Promise<EitherResult<any>>;
}

// Enrollment API types
interface EnrollmentApi {
  getStudentEnrollments: (studentId: string) => Promise<EitherResult<any[]>>;
}

// Database API types
interface DBApi {
  checkStatus: () => Promise<EitherResult<{ connected: boolean }>>;
}

// Combined API interface
interface Api {
  student: StudentApi;
  group: GroupApi;
  subject: SubjectApi;
  payment: PaymentApi;
  subscription: SubscriptionApi;
  utility: UtilityApi;
  enrollment: EnrollmentApi;
  db: DBApi;
}

// Extend Window interface
declare global {
  interface Window {
    api: Api;
    electronAPI: {
      getAppPath: () => Promise<string>;
      exportData: (type: string, fileName: string, data: any[]) => Promise<string>;
      generatePdf: (fileName: string, html: string) => Promise<string>;
      createBackup: (backupPath?: string) => Promise<string>;
      loadBackup: (backupPath: string) => Promise<boolean>;
      getSettings: () => Promise<Record<string, any>>;
      saveSettings: (settings: Record<string, any>) => Promise<boolean>;
    };
  }
} 