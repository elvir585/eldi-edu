'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('eldiDesktop', Object.freeze({
  version: '12.0.0',
  runCode: request => ipcRenderer.invoke('eldi:run-code', request),
  cancelRun: () => ipcRenderer.invoke('eldi:cancel-run'),
  runtimeStatus: () => ipcRenderer.invoke('eldi:runtime-status'),
  printPage: () => ipcRenderer.invoke('eldi:print-page'),
  savePdf: filename => ipcRenderer.invoke('eldi:save-certificate-pdf', filename),
  readLearningPack: bytes => ipcRenderer.invoke('eldi:read-learning-pack', bytes),
  saveLearningPack: pack => ipcRenderer.invoke('eldi:save-learning-pack', pack),
  readBlockPack: bytes => ipcRenderer.invoke('eldi:read-block-pack', bytes),
  saveBlockPack: catalog => ipcRenderer.invoke('eldi:save-block-pack', catalog),
  aiStatus: () => ipcRenderer.invoke('eldi:ai-status'),
  aiRefreshStatus: () => ipcRenderer.invoke('eldi:ai-refresh-status'),
  aiLogin: type => ipcRenderer.invoke('eldi:ai-login',type),
  aiLoginCancel: () => ipcRenderer.invoke('eldi:ai-login-cancel'),
  aiLogout: () => ipcRenderer.invoke('eldi:ai-logout'),
  onAIStatus: listener => {if(typeof listener!=='function')throw Error('Nedostaje slušalac statusa.');const wrapped=(_event,status)=>listener(status);ipcRenderer.on('ai-status',wrapped);return()=>ipcRenderer.removeListener('ai-status',wrapped);},
  gradeProgram: request => ipcRenderer.invoke('eldi:program-grade',request),
  cancelProgramGrade: () => ipcRenderer.invoke('eldi:program-grade-cancel'),
  programSolution: request => ipcRenderer.invoke('eldi:program-solution',request),
  backupSave: (value,force=false) => ipcRenderer.invoke('eldi:backup-save',value,force),
  backupList: () => ipcRenderer.invoke('eldi:backup-list'),
  backupRead: id => ipcRenderer.invoke('eldi:backup-read',id),
  checkUpdates: () => ipcRenderer.invoke('eldi:check-updates'),
  openRelease: url => ipcRenderer.invoke('eldi:open-release',url),
  aiSaveSettings: settings => ipcRenderer.invoke('eldi:ai-save-settings', settings),
  aiAsk: request => ipcRenderer.invoke('eldi:ai-ask', request),
  aiCancel: () => ipcRenderer.invoke('eldi:ai-cancel')
}));
