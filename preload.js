// Preload script for Electron
const { contextBridge, ipcRenderer } = require('electron');

/**
 * Logs IPC requests from the renderer
 * @param {string} channel - IPC channel
 * @param {any} data - Request data
 */
function logIpcRequest(channel, data) {
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
  exportData: (type, fileName, data) => 
    ipcRenderer.invoke('export-data', { type, fileName, data }),
  
  /**
   * Creates a PDF from HTML content
   * @param {string} fileName - Name of the PDF file to save
   * @param {string} html - HTML content for the PDF
   * @returns {Promise<string>} Path to the saved PDF
   */
  generatePdf: (fileName, html) =>
    ipcRenderer.invoke('generate-pdf', { fileName, html }),
  
  /**
   * Creates a database backup
   * @param {string} backupPath - Optional custom path for the backup
   * @returns {Promise<string>} Path to the backup file
   */
  createBackup: (backupPath) =>
    ipcRenderer.invoke('create-backup', { backupPath }),
  
  /**
   * Loads a database backup
   * @param {string} backupPath - Path to the backup file
   * @returns {Promise<boolean>} Success status
   */
  loadBackup: (backupPath) => 
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
  saveSettings: (settings) => 
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
    validateAccessCode: (code) => {
      logIpcRequest('auth:validateAccessCode', { code: '****' }); // Don't log actual code
      return ipcRenderer.invoke('auth:validateAccessCode', code);
    },
    updateAccessCode: (newCode) => {
      logIpcRequest('auth:updateAccessCode', { newCode: '****' }); // Don't log actual code
      return ipcRenderer.invoke('auth:updateAccessCode', newCode);
    }
  },
  
  /**
   * Database utilities
   */
  db: {
    checkStatus: () => {
      logIpcRequest('db:checkStatus', {});
      return ipcRenderer.invoke('db:checkStatus');
    }
  },
  
  /**
   * Student API methods
   */
  student: {
    createStudent: (data) => {
      logIpcRequest('student:createStudent', data);
      return ipcRenderer.invoke('student:createStudent', data);
    },
    listStudents: (filter) => {
      logIpcRequest('student:listStudents', filter);
      return ipcRenderer.invoke('student:listStudents', filter);
    },
    updateStudent: (id, data) => {
      logIpcRequest('student:updateStudent', { id, data });
      return ipcRenderer.invoke('student:updateStudent', id, data);
    },
    softDeleteStudent: (id) => {
      logIpcRequest('student:softDeleteStudent', { id });
      return ipcRenderer.invoke('student:softDeleteStudent', id);
    },
    restoreKickedStudent: (id) => {
      logIpcRequest('student:restoreKickedStudent', { id });
      return ipcRenderer.invoke('student:restoreKickedStudent', id);
    },
    exportStudents: (filter) => {
      logIpcRequest('student:exportStudents', filter);
      return ipcRenderer.invoke('student:exportStudents', filter);
    },
    bulkMoveStudents: (groupId, studentIds) => {
      logIpcRequest('student:bulkMoveStudents', { groupId, studentIds });
      return ipcRenderer.invoke('student:bulkMoveStudents', groupId, studentIds);
    }
  },
  
  /**
   * Group API methods
   */
  group: {
    createGroup: (subjectId, data) => {
      logIpcRequest('group:createGroup', { subjectId, data });
      return ipcRenderer.invoke('group:createGroup', subjectId, data);
    },
    listGroups: (subjectId) => {
      logIpcRequest('group:listGroups', { subjectId });
      return ipcRenderer.invoke('group:listGroups', subjectId);
    },
    getGroup: (id) => {
      logIpcRequest('group:getGroup', { id });
      return ipcRenderer.invoke('group:getGroup', id);
    },
    updateGroup: (id, data) => {
      logIpcRequest('group:updateGroup', { id, data });
      return ipcRenderer.invoke('group:updateGroup', id, data);
    },
    reorderGroups: (subjectId, newOrder) => {
      logIpcRequest('group:reorderGroups', { subjectId, newOrder });
      return ipcRenderer.invoke('group:reorderGroups', subjectId, newOrder);
    },
    enrollStudentToGroup: (studentId, groupId) => {
      logIpcRequest('group:enrollStudentToGroup', { studentId, groupId });
      return ipcRenderer.invoke('group:enrollStudentToGroup', studentId, groupId);
    },
    moveStudentToGroup: (studentId, fromGroupId, toGroupId) => {
      logIpcRequest('group:moveStudentToGroup', { studentId, fromGroupId, toGroupId });
      return ipcRenderer.invoke('group:moveStudentToGroup', studentId, fromGroupId, toGroupId);
    },
    removeStudentFromGroup: (studentId, groupId) => {
      logIpcRequest('group:removeStudentFromGroup', { studentId, groupId });
      return ipcRenderer.invoke('group:removeStudentFromGroup', studentId, groupId);
    }
  },
  
  /**
   * Subject API methods
   */
  subject: {
    createSubject: (data) => {
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
    getSubjectDetails: (id) => {
      logIpcRequest('subject:getSubjectDetails', { id });
      return ipcRenderer.invoke('subject:getSubjectDetails', id);
    },
    updateSubject: (id, data) => {
      logIpcRequest('subject:updateSubject', { id, data });
      return ipcRenderer.invoke('subject:updateSubject', id, data);
    },
    deleteSubject: (id) => {
      logIpcRequest('subject:deleteSubject', { id });
      return ipcRenderer.invoke('subject:deleteSubject', id);
    }
  },
  
  /**
   * Payment API methods
   */
  payment: {
    createPayment: (data) => {
      logIpcRequest('payment:createPayment', data);
      return ipcRenderer.invoke('payment:createPayment', data);
    },
    listPaymentsByStudent: (studentId) => {
      logIpcRequest('payment:listPaymentsByStudent', { studentId });
      return ipcRenderer.invoke('payment:listPaymentsByStudent', studentId);
    },
    getPendingPayments: (filter) => {
      logIpcRequest('payment:getPendingPayments', filter);
      return ipcRenderer.invoke('payment:getPendingPayments', filter);
    },
    getMonthlySummary: (month, year) => {
      logIpcRequest('payment:getMonthlySummary', { month, year });
      return ipcRenderer.invoke('payment:getMonthlySummary', month, year);
    }
  }
});

console.log('Preload script loaded successfully'); 