'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('eldiDesktop', Object.freeze({
  version: '10.5.1',
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
  aiSaveSettings: settings => ipcRenderer.invoke('eldi:ai-save-settings', settings),
  aiAsk: request => ipcRenderer.invoke('eldi:ai-ask', request),
  aiCancel: () => ipcRenderer.invoke('eldi:ai-cancel')
}));
