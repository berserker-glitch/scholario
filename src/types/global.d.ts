interface EitherResult<T> {
  _tag: 'Left' | 'Right';
  left?: Error;
  right?: T;
}

interface ElectronAPI {
  getAppPath: () => Promise<string>;
  exportData: (type: string, fileName: string, data: any[]) => Promise<string>;
  generatePdf: (fileName: string, html: string) => Promise<string>;
  createBackup: (backupPath?: string) => Promise<string>;
  loadBackup: (backupPath: string) => Promise<boolean>;
  getSettings: () => Promise<Record<string, any>>;
  saveSettings: (settings: Record<string, any>) => Promise<boolean>;
}

interface AppAPI {
  auth: {
    initialize: () => Promise<EitherResult<boolean>>;
    validateAccessCode: (code: string) => Promise<EitherResult<boolean>>;
    updateAccessCode: (newCode: string) => Promise<EitherResult<boolean>>;
  };
  student: {
    createStudent: (data: any) => Promise<EitherResult<any>>;
    listStudents: (filter?: any) => Promise<EitherResult<any[]>>;
    updateStudent: (id: string, data: any) => Promise<EitherResult<any>>;
    softDeleteStudent: (id: string) => Promise<EitherResult<boolean>>;
    restoreKickedStudent: (id: string) => Promise<EitherResult<any>>;
    exportStudents: (filter?: any) => Promise<EitherResult<any[]>>;
    bulkMoveStudents: (groupId: string, studentIds: string[]) => Promise<EitherResult<boolean>>;
  };
  group: {
    createGroup: (subjectId: string, data: any) => Promise<EitherResult<any>>;
    listGroups: (subjectId: string) => Promise<EitherResult<any[]>>;
    listAllGroups: () => Promise<EitherResult<any[]>>;
    getGroup: (id: string) => Promise<EitherResult<any>>;
    updateGroup: (id: string, data: any) => Promise<EitherResult<any>>;
    reorderGroups: (subjectId: string, newOrder: string[]) => Promise<EitherResult<boolean>>;
    enrollStudentToGroup: (studentId: string, groupId: string) => Promise<EitherResult<boolean>>;
    moveStudentToGroup: (studentId: string, fromGroupId: string, toGroupId: string) => Promise<EitherResult<boolean>>;
    removeStudentFromGroup: (studentId: string, groupId: string) => Promise<EitherResult<boolean>>;
  };
  subject: {
    createSubject: (data: any) => Promise<EitherResult<any>>;
    listSubjects: () => Promise<EitherResult<any[]>>;
    getSubjectDetails: (id: string) => Promise<EitherResult<any>>;
    updateSubject: (id: string, data: any) => Promise<EitherResult<any>>;
    deleteSubject: (id: string) => Promise<EitherResult<boolean>>;
  };
  payment: {
    createPayment: (data: any) => Promise<EitherResult<any>>;
    listPaymentsByStudent: (studentId: string) => Promise<EitherResult<any[]>>;
    getPendingPayments: (filter?: any) => Promise<EitherResult<any[]>>;
    getMonthlySummary: (month: number, year: number) => Promise<EitherResult<any>>;
    flagPartialPayment: (paymentId: string) => Promise<EitherResult<boolean>>;
    overridePaymentAmount: (paymentId: string, newAmount: number, reason: string) => Promise<EitherResult<boolean>>;
    getStudentPayments: (studentId: string) => Promise<EitherResult<any[]>>;
    getPaymentStats: () => Promise<EitherResult<{
      monthlyRevenue: number;
      pendingPayments: number;
      collectionRate: number;
    }>>;
  };
  subscription: {
    createOrUpdateSubscription: (studentId: string, subjectId: string, month: string, data: any) => Promise<EitherResult<any>>;
    listSubscriptions: (filter?: any) => Promise<EitherResult<any[]>>;
    getSubscriptionStatus: (studentId: string, subjectId: string, month: string) => Promise<EitherResult<any>>;
    markAsPaid: (subscriptionId: string) => Promise<EitherResult<boolean>>;
    flagUnpaid: (subscriptionId: string) => Promise<EitherResult<boolean>>;
    generateReceipt: (subscriptionId: string) => Promise<EitherResult<string>>;
  };
  utility: {
    backupNow: () => Promise<EitherResult<string>>;
    restoreBackup: (filePath: string) => Promise<EitherResult<boolean>>;
    listBackups: () => Promise<EitherResult<any[]>>;
  };
  enrollment: {
    getStudentEnrollments: (studentId: string) => Promise<EitherResult<any[]>>;
  };
  db: {
    checkStatus: () => Promise<EitherResult<{ connected: boolean }>>;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    api: AppAPI;
  }
}

interface Window {
  api: {
    student: {
      listStudents: (filter: any) => any;
      createStudent: (data: any) => any;
      updateStudent: (id: string, data: any) => any;
      softDeleteStudent: (id: string) => any;
      restoreKickedStudent: (id: string) => any;
      bulkMoveStudents: (groupId: string, studentIds: string[]) => any;
      exportStudents: (filter: any) => any;
    };
    db: {
      checkStatus: () => any;
    };
  };
  electronAPI: {
    exportData: (format: string, fileName: string, data: any) => Promise<string>;
  };
} 