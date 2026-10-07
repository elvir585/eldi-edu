'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('eldiDesktop', Object.freeze({
  version: '10.0.0',
  runCode: request => ipcRenderer.invoke('eldi:run-code', request),
  cancelRun: () => ipcRenderer.invoke('eldi:cancel-run'),
  runtimeStatus: () => ipcRenderer.invoke('eldi:runtime-status'),
  printPage: () => ipcRenderer.invoke('eldi:print-page')
}));
