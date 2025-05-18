"use strict";
const electron = require("electron");
function logIpcRequest(channel, data) {
  console.debug(`IPC Request: ${channel}`, data);
}
electron.contextBridge.exposeInMainWorld("electronAPI", {
  /**
   * Gets the app's user data path
   * @returns {Promise<string>} The user data path
   */
  getAppPath: () => electron.ipcRenderer.invoke("get-app-path"),
  /**
   * Exports data to CSV/XLSX
   * @param {string} type - Export type (csv or xlsx)
   * @param {string} fileName - Name of the file to save
   * @param {any[]} data - Data to export
   * @returns {Promise<string>} Path to the saved file
   */
  exportData: (type, fileName, data) => electron.ipcRenderer.invoke("export-data", { type, fileName, data }),
  /**
   * Creates a PDF from HTML content
   * @param {string} fileName - Name of the PDF file to save
   * @param {string} html - HTML content for the PDF
   * @returns {Promise<string>} Path to the saved PDF
   */
  generatePdf: (fileName, html) => electron.ipcRenderer.invoke("generate-pdf", { fileName, html }),
  /**
   * Creates a database backup
   * @param {string} backupPath - Optional custom path for the backup
   * @returns {Promise<string>} Path to the backup file
   */
  createBackup: (backupPath) => electron.ipcRenderer.invoke("create-backup", { backupPath }),
  /**
   * Loads a database backup
   * @param {string} backupPath - Path to the backup file
   * @returns {Promise<boolean>} Success status
   */
  loadBackup: (backupPath) => electron.ipcRenderer.invoke("load-backup", { backupPath }),
  /**
   * Gets app settings from the store
   * @returns {Promise<Record<string, any>>} App settings
   */
  getSettings: () => electron.ipcRenderer.invoke("get-settings"),
  /**
   * Saves app settings to the store
   * @param {Record<string, any>} settings - Settings to save
   * @returns {Promise<boolean>} Success status
   */
  saveSettings: (settings) => electron.ipcRenderer.invoke("save-settings", settings)
});
electron.contextBridge.exposeInMainWorld("api", {
  /**
   * Authentication API methods
   */
  auth: {
    initialize: () => {
      logIpcRequest("auth:initialize", {});
      return electron.ipcRenderer.invoke("auth:initialize");
    },
    validateAccessCode: (code) => {
      logIpcRequest("auth:validateAccessCode", { code: "****" });
      return electron.ipcRenderer.invoke("auth:validateAccessCode", code);
    },
    updateAccessCode: (newCode) => {
      logIpcRequest("auth:updateAccessCode", { newCode: "****" });
      return electron.ipcRenderer.invoke("auth:updateAccessCode", newCode);
    }
  },
  /**
   * Student API methods
   */
  student: {
    createStudent: (data) => {
      logIpcRequest("student:createStudent", data);
      return electron.ipcRenderer.invoke("student:createStudent", data);
    },
    listStudents: (filter) => {
      logIpcRequest("student:listStudents", filter);
      return electron.ipcRenderer.invoke("student:listStudents", filter);
    },
    updateStudent: (id, data) => {
      logIpcRequest("student:updateStudent", { id, data });
      return electron.ipcRenderer.invoke("student:updateStudent", id, data);
    },
    softDeleteStudent: (id) => {
      logIpcRequest("student:softDeleteStudent", { id });
      return electron.ipcRenderer.invoke("student:softDeleteStudent", id);
    },
    restoreKickedStudent: (id) => {
      logIpcRequest("student:restoreKickedStudent", { id });
      return electron.ipcRenderer.invoke("student:restoreKickedStudent", id);
    },
    exportStudents: (filter) => {
      logIpcRequest("student:exportStudents", filter);
      return electron.ipcRenderer.invoke("student:exportStudents", filter);
    },
    bulkMoveStudents: (groupId, studentIds) => {
      logIpcRequest("student:bulkMoveStudents", { groupId, studentIds });
      return electron.ipcRenderer.invoke("student:bulkMoveStudents", groupId, studentIds);
    }
  },
  /**
   * Group API methods
   */
  group: {
    createGroup: (subjectId, data) => {
      logIpcRequest("group:createGroup", { subjectId, data });
      return electron.ipcRenderer.invoke("group:createGroup", subjectId, data);
    },
    directCreateGroup: (subjectId, data) => {
      logIpcRequest("group:directCreateGroup", { subjectId, data });
      return electron.ipcRenderer.invoke("group:directCreateGroup", subjectId, data);
    },
    listGroups: (subjectId) => {
      logIpcRequest("group:listGroups", { subjectId });
      return electron.ipcRenderer.invoke("group:listGroups", subjectId);
    },
    listAllGroups: () => {
      logIpcRequest("group:listAllGroups", {});
      return electron.ipcRenderer.invoke("group:listAllGroups");
    },
    getGroup: (id) => {
      logIpcRequest("group:getGroup", { id });
      return electron.ipcRenderer.invoke("group:getGroup", id);
    },
    updateGroup: (id, data) => {
      logIpcRequest("group:updateGroup", { id, data });
      return electron.ipcRenderer.invoke("group:updateGroup", id, data);
    },
    reorderGroups: (subjectId, newOrder) => {
      logIpcRequest("group:reorderGroups", { subjectId, newOrder });
      return electron.ipcRenderer.invoke("group:reorderGroups", subjectId, newOrder);
    },
    enrollStudentToGroup: (studentId, groupId) => {
      logIpcRequest("group:enrollStudentToGroup", { studentId, groupId });
      return electron.ipcRenderer.invoke("group:enrollStudentToGroup", studentId, groupId);
    },
    moveStudentToGroup: (studentId, fromGroupId, toGroupId) => {
      logIpcRequest("group:moveStudentToGroup", { studentId, fromGroupId, toGroupId });
      return electron.ipcRenderer.invoke("group:moveStudentToGroup", studentId, fromGroupId, toGroupId);
    },
    removeStudentFromGroup: (studentId, groupId) => {
      logIpcRequest("group:removeStudentFromGroup", { studentId, groupId });
      return electron.ipcRenderer.invoke("group:removeStudentFromGroup", studentId, groupId);
    }
  },
  /**
   * Subject API methods
   */
  subject: {
    createSubject: (data) => {
      logIpcRequest("subject:createSubject", data);
      return electron.ipcRenderer.invoke("subject:createSubject", data);
    },
    listSubjects: () => {
      logIpcRequest("subject:listSubjects", {});
      return electron.ipcRenderer.invoke("subject:listSubjects");
    },
    getDirectSubjects: () => {
      logIpcRequest("subject:getDirectSubjects", {});
      return electron.ipcRenderer.invoke("subject:getDirectSubjects");
    },
    getSubjectDetails: (id) => {
      logIpcRequest("subject:getSubjectDetails", { id });
      return electron.ipcRenderer.invoke("subject:getSubjectDetails", id);
    },
    updateSubject: (id, data) => {
      logIpcRequest("subject:updateSubject", { id, data });
      return electron.ipcRenderer.invoke("subject:updateSubject", id, data);
    },
    deleteSubject: (id) => {
      logIpcRequest("subject:deleteSubject", { id });
      return electron.ipcRenderer.invoke("subject:deleteSubject", id);
    },
    directDeleteSubject: (id) => {
      logIpcRequest("subject:directDeleteSubject", { id });
      return electron.ipcRenderer.invoke("subject:directDeleteSubject", id);
    }
  },
  /**
   * Payment API methods
   */
  payment: {
    createPayment: (data) => {
      logIpcRequest("payment:createPayment", data);
      return electron.ipcRenderer.invoke("payment:createPayment", data);
    },
    getPaymentStats: () => {
      logIpcRequest("payment:getPaymentStats", {});
      return electron.ipcRenderer.invoke("payment:getPaymentStats");
    },
    getStudentPayments: (studentId) => {
      logIpcRequest("payment:getStudentPayments", { studentId });
      return electron.ipcRenderer.invoke("payment:getStudentPayments", studentId);
    },
    listPaymentsByStudent: (studentId) => {
      logIpcRequest("payment:listPaymentsByStudent", { studentId });
      return electron.ipcRenderer.invoke("payment:listPaymentsByStudent", studentId);
    },
    getPendingPayments: (filter) => {
      logIpcRequest("payment:getPendingPayments", filter);
      return electron.ipcRenderer.invoke("payment:getPendingPayments", filter);
    },
    getMonthlySummary: (month, year) => {
      logIpcRequest("payment:getMonthlySummary", { month, year });
      return electron.ipcRenderer.invoke("payment:getMonthlySummary", month, year);
    },
    flagPartialPayment: (paymentId) => {
      logIpcRequest("payment:flagPartialPayment", { paymentId });
      return electron.ipcRenderer.invoke("payment:flagPartialPayment", paymentId);
    },
    overridePaymentAmount: (paymentId, newAmount, reason) => {
      logIpcRequest("payment:overridePaymentAmount", { paymentId, newAmount, reason });
      return electron.ipcRenderer.invoke("payment:overridePaymentAmount", paymentId, newAmount, reason);
    }
  },
  /**
   * Subscription API methods
   */
  subscription: {
    createOrUpdateSubscription: (studentId, subjectId, month, data) => {
      logIpcRequest("subscription:createOrUpdateSubscription", { studentId, subjectId, month, data });
      return electron.ipcRenderer.invoke("subscription:createOrUpdateSubscription", studentId, subjectId, month, data);
    },
    listSubscriptions: (filter) => {
      logIpcRequest("subscription:listSubscriptions", filter);
      return electron.ipcRenderer.invoke("subscription:listSubscriptions", filter);
    },
    getSubscriptionStatus: (studentId, subjectId, month) => {
      logIpcRequest("subscription:getSubscriptionStatus", { studentId, subjectId, month });
      return electron.ipcRenderer.invoke("subscription:getSubscriptionStatus", studentId, subjectId, month);
    },
    markAsPaid: (subscriptionId) => {
      logIpcRequest("subscription:markAsPaid", { subscriptionId });
      return electron.ipcRenderer.invoke("subscription:markAsPaid", subscriptionId);
    },
    flagUnpaid: (subscriptionId) => {
      logIpcRequest("subscription:flagUnpaid", { subscriptionId });
      return electron.ipcRenderer.invoke("subscription:flagUnpaid", subscriptionId);
    },
    generateReceipt: (subscriptionId) => {
      logIpcRequest("subscription:generateReceipt", { subscriptionId });
      return electron.ipcRenderer.invoke("subscription:generateReceipt", subscriptionId);
    }
  },
  /**
   * Utility API methods
   */
  utility: {
    backupNow: () => {
      logIpcRequest("utility:backupNow", {});
      return electron.ipcRenderer.invoke("utility:backupNow");
    },
    restoreBackup: (filePath) => {
      logIpcRequest("utility:restoreBackup", { filePath });
      return electron.ipcRenderer.invoke("utility:restoreBackup", filePath);
    },
    listBackups: () => {
      logIpcRequest("utility:listBackups", {});
      return electron.ipcRenderer.invoke("utility:listBackups");
    },
    exportToCSV: (entity, filter) => {
      logIpcRequest("utility:exportToCSV", { entity, filter });
      return electron.ipcRenderer.invoke("utility:exportToCSV", entity, filter);
    },
    generateAttendancePDF: (groupId, date) => {
      logIpcRequest("utility:generateAttendancePDF", { groupId, date });
      return electron.ipcRenderer.invoke("utility:generateAttendancePDF", groupId, date);
    }
  },
  /**
   * Database API methods
   */
  db: {
    checkStatus: () => {
      logIpcRequest("db:checkStatus", {});
      return electron.ipcRenderer.invoke("db:checkStatus");
    },
    inspectTable: (tableName) => {
      logIpcRequest("db:inspectTable", { tableName });
      return electron.ipcRenderer.invoke("db:inspectTable", tableName);
    },
    updateSchema: () => {
      logIpcRequest("db:updateSchema", {});
      return electron.ipcRenderer.invoke("db:updateSchema");
    },
    generateSchemaReport: () => {
      logIpcRequest("db:generateSchemaReport", {});
      return electron.ipcRenderer.invoke("db:generateSchemaReport");
    }
  }
});
