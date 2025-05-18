import { contextBridge, ipcRenderer } from 'electron';

/**
 * Logs IPC requests from the renderer
 * @param channel - IPC channel
 * @param data - Request data
 */
function logIpcRequest(channel: string, data: any): void {
  console.debug(`IPC Request: ${channel}`, data);
}

/**
 * Exposes a limited set of Electron functionality to the renderer process
 * through a secure 'electronAPI' bridge
 */
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Gets the app's user data path
   * @returns {Promise<string>} The user data path
   */
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  
  /**
   * Exports data to CSV/XLSX
   * @param {string} type - Export type (csv or xlsx)
   * @param {string} fileName - Name of the file to save
   * @param {any[]} data - Data to export
   * @returns {Promise<string>} Path to the saved file
   */
  exportData: (type: string, fileName: string, data: any[]) => 
    ipcRenderer.invoke('export-data', { type, fileName, data }),
  
  /**
   * Creates a PDF from HTML content
   * @param {string} fileName - Name of the PDF file to save
   * @param {string} html - HTML content for the PDF
   * @returns {Promise<string>} Path to the saved PDF
   */
  generatePdf: (fileName: string, html: string) =>
    ipcRenderer.invoke('generate-pdf', { fileName, html }),
  
  /**
   * Creates a database backup
   * @param {string} backupPath - Optional custom path for the backup
   * @returns {Promise<string>} Path to the backup file
   */
  createBackup: (backupPath?: string) =>
    ipcRenderer.invoke('create-backup', { backupPath }),
  
  /**
   * Loads a database backup
   * @param {string} backupPath - Path to the backup file
   * @returns {Promise<boolean>} Success status
   */
  loadBackup: (backupPath: string) => 
    ipcRenderer.invoke('load-backup', { backupPath }),
  
  /**
   * Gets app settings from the store
   * @returns {Promise<Record<string, any>>} App settings
   */
  getSettings: () => ipcRenderer.invoke('get-settings'),
  
  /**
   * Saves app settings to the store
   * @param {Record<string, any>} settings - Settings to save
   * @returns {Promise<boolean>} Success status
   */
  saveSettings: (settings: Record<string, any>) => 
    ipcRenderer.invoke('save-settings', settings)
});

/**
 * Expose domain-specific APIs to the renderer process
 */
contextBridge.exposeInMainWorld('api', {
  /**
   * Authentication API methods
   */
  auth: {
    initialize: () => {
      logIpcRequest('auth:initialize', {});
      return ipcRenderer.invoke('auth:initialize');
    },
    validateAccessCode: (code: string) => {
      logIpcRequest('auth:validateAccessCode', { code: '****' }); // Don't log actual code
      return ipcRenderer.invoke('auth:validateAccessCode', code);
    },
    updateAccessCode: (newCode: string) => {
      logIpcRequest('auth:updateAccessCode', { newCode: '****' }); // Don't log actual code
      return ipcRenderer.invoke('auth:updateAccessCode', newCode);
    }
  },
  
  /**
   * Student API methods
   */
  student: {
    createStudent: (data: any) => {
      logIpcRequest('student:createStudent', data);
      return ipcRenderer.invoke('student:createStudent', data);
    },
    listStudents: (filter?: any) => {
      logIpcRequest('student:listStudents', filter);
      return ipcRenderer.invoke('student:listStudents', filter);
    },
    updateStudent: (id: string, data: any) => {
      logIpcRequest('student:updateStudent', { id, data });
      return ipcRenderer.invoke('student:updateStudent', id, data);
    },
    softDeleteStudent: (id: string) => {
      logIpcRequest('student:softDeleteStudent', { id });
      return ipcRenderer.invoke('student:softDeleteStudent', id);
    },
    restoreKickedStudent: (id: string) => {
      logIpcRequest('student:restoreKickedStudent', { id });
      return ipcRenderer.invoke('student:restoreKickedStudent', id);
    },
    exportStudents: (filter?: any) => {
      logIpcRequest('student:exportStudents', filter);
      return ipcRenderer.invoke('student:exportStudents', filter);
    },
    bulkMoveStudents: (groupId: string, studentIds: string[]) => {
      logIpcRequest('student:bulkMoveStudents', { groupId, studentIds });
      return ipcRenderer.invoke('student:bulkMoveStudents', groupId, studentIds);
    }
  },
  
  /**
   * Group API methods
   */
  group: {
    createGroup: (subjectId: string, data: any) => {
      logIpcRequest('group:createGroup', { subjectId, data });
      return ipcRenderer.invoke('group:createGroup', subjectId, data);
    },
    listGroups: (subjectId: string) => {
      logIpcRequest('group:listGroups', { subjectId });
      return ipcRenderer.invoke('group:listGroups', subjectId);
    },
    listAllGroups: () => {
      logIpcRequest('group:listAllGroups', {});
      return ipcRenderer.invoke('group:listAllGroups');
    },
    getDirectGroups: () => {
      logIpcRequest('group:getDirectGroups', {});
      return ipcRenderer.invoke('group:getDirectGroups');
    },
    getGroup: (id: string) => {
      logIpcRequest('group:getGroup', { id });
      return ipcRenderer.invoke('group:getGroup', id);
    },
    updateGroup: (id: string, data: any) => {
      logIpcRequest('group:updateGroup', { id, data });
      return ipcRenderer.invoke('group:updateGroup', id, data);
    },
    reorderGroups: (subjectId: string, newOrder: string[]) => {
      logIpcRequest('group:reorderGroups', { subjectId, newOrder });
      return ipcRenderer.invoke('group:reorderGroups', subjectId, newOrder);
    },
    enrollStudentToGroup: (studentId: string, groupId: string) => {
      logIpcRequest('group:enrollStudentToGroup', { studentId, groupId });
      return ipcRenderer.invoke('group:enrollStudentToGroup', studentId, groupId);
    },
    moveStudentToGroup: (studentId: string, fromGroupId: string, toGroupId: string) => {
      logIpcRequest('group:moveStudentToGroup', { studentId, fromGroupId, toGroupId });
      return ipcRenderer.invoke('group:moveStudentToGroup', studentId, fromGroupId, toGroupId);
    },
    removeStudentFromGroup: (studentId: string, groupId: string) => {
      logIpcRequest('group:removeStudentFromGroup', { studentId, groupId });
      return ipcRenderer.invoke('group:removeStudentFromGroup', studentId, groupId);
    }
  },
  
  /**
   * Subject API methods
   */
  subject: {
    createSubject: (data: any) => {
      logIpcRequest('subject:createSubject', data);
      return ipcRenderer.invoke('subject:createSubject', data);
    },
    listSubjects: () => {
      logIpcRequest('subject:listSubjects', {});
      return ipcRenderer.invoke('subject:listSubjects');
    },
    getDirectSubjects: () => {
      logIpcRequest('subject:getDirectSubjects', {});
      return ipcRenderer.invoke('subject:getDirectSubjects');
    },
    getSubjectDetails: (id: string) => {
      logIpcRequest('subject:getSubjectDetails', { id });
      return ipcRenderer.invoke('subject:getSubjectDetails', id);
    },
    updateSubject: (id: string, data: any) => {
      logIpcRequest('subject:updateSubject', { id, data });
      return ipcRenderer.invoke('subject:updateSubject', id, data);
    },
    deleteSubject: (id: string) => {
      logIpcRequest('subject:deleteSubject', { id });
      return ipcRenderer.invoke('subject:deleteSubject', id);
    }
  },
  
  /**
   * Payment API methods
   */
  payment: {
    createPayment: (data: any) => {
      logIpcRequest('payment:createPayment', data);
      return ipcRenderer.invoke('payment:createPayment', data);
    },
    getPaymentStats: () => {
      logIpcRequest('payment:getPaymentStats', {});
      return ipcRenderer.invoke('payment:getPaymentStats');
    },
    getStudentPayments: (studentId: string) => {
      logIpcRequest('payment:getStudentPayments', { studentId });
      return ipcRenderer.invoke('payment:getStudentPayments', studentId);
    },
    listPaymentsByStudent: (studentId: string) => {
      logIpcRequest('payment:listPaymentsByStudent', { studentId });
      return ipcRenderer.invoke('payment:listPaymentsByStudent', studentId);
    },
    getPendingPayments: (filter?: any) => {
      logIpcRequest('payment:getPendingPayments', filter);
      return ipcRenderer.invoke('payment:getPendingPayments', filter);
    },
    getMonthlySummary: (month: number, year: number) => {
      logIpcRequest('payment:getMonthlySummary', { month, year });
      return ipcRenderer.invoke('payment:getMonthlySummary', month, year);
    },
    flagPartialPayment: (paymentId: string) => {
      logIpcRequest('payment:flagPartialPayment', { paymentId });
      return ipcRenderer.invoke('payment:flagPartialPayment', paymentId);
    },
    overridePaymentAmount: (paymentId: string, newAmount: number, reason: string) => {
      logIpcRequest('payment:overridePaymentAmount', { paymentId, newAmount, reason });
      return ipcRenderer.invoke('payment:overridePaymentAmount', paymentId, newAmount, reason);
    }
  },
  
  /**
   * Subscription API methods
   */
  subscription: {
    createOrUpdateSubscription: (studentId: string, subjectId: string, month: string, data: any) => {
      logIpcRequest('subscription:createOrUpdateSubscription', { studentId, subjectId, month, data });
      return ipcRenderer.invoke('subscription:createOrUpdateSubscription', studentId, subjectId, month, data);
    },
    listSubscriptions: (filter?: any) => {
      logIpcRequest('subscription:listSubscriptions', filter);
      return ipcRenderer.invoke('subscription:listSubscriptions', filter);
    },
    getSubscriptionStatus: (studentId: string, subjectId: string, month: string) => {
      logIpcRequest('subscription:getSubscriptionStatus', { studentId, subjectId, month });
      return ipcRenderer.invoke('subscription:getSubscriptionStatus', studentId, subjectId, month);
    },
    markAsPaid: (subscriptionId: string) => {
      logIpcRequest('subscription:markAsPaid', { subscriptionId });
      return ipcRenderer.invoke('subscription:markAsPaid', subscriptionId);
    },
    flagUnpaid: (subscriptionId: string) => {
      logIpcRequest('subscription:flagUnpaid', { subscriptionId });
      return ipcRenderer.invoke('subscription:flagUnpaid', subscriptionId);
    },
    generateReceipt: (subscriptionId: string) => {
      logIpcRequest('subscription:generateReceipt', { subscriptionId });
      return ipcRenderer.invoke('subscription:generateReceipt', subscriptionId);
    }
  },
  
  /**
   * Utility API methods
   */
  utility: {
    backupNow: () => {
      logIpcRequest('utility:backupNow', {});
      return ipcRenderer.invoke('utility:backupNow');
    },
    restoreBackup: (filePath: string) => {
      logIpcRequest('utility:restoreBackup', { filePath });
      return ipcRenderer.invoke('utility:restoreBackup', filePath);
    },
    listBackups: () => {
      logIpcRequest('utility:listBackups', {});
      return ipcRenderer.invoke('utility:listBackups');
    },
    exportToCSV: (entity: string, filter?: any) => {
      logIpcRequest('utility:exportToCSV', { entity, filter });
      return ipcRenderer.invoke('utility:exportToCSV', entity, filter);
    },
    generateAttendancePDF: (groupId: string, date: string) => {
      logIpcRequest('utility:generateAttendancePDF', { groupId, date });
      return ipcRenderer.invoke('utility:generateAttendancePDF', groupId, date);
    }
  },
  
  /**
   * Database API methods
   */
  db: {
    checkStatus: () => {
      logIpcRequest('db:checkStatus', {});
      return ipcRenderer.invoke('db:checkStatus');
    }
  }
}); 