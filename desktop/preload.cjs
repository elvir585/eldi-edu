'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('eldiDesktop', Object.freeze({
  version: '10.2.1',
  runCode: request => ipcRenderer.invoke('eldi:run-code', request),
  cancelRun: () => ipcRenderer.invoke('eldi:cancel-run'),
  runtimeStatus: () => ipcRenderer.invoke('eldi:runtime-status'),
  printPage: () => ipcRenderer.invoke('eldi:print-page'),
  savePdf: filename => ipcRenderer.invoke('eldi:save-certificate-pdf', filename)
}));
