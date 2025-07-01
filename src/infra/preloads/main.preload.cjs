const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('printerAPI', {
  getPrinters: () => ipcRenderer.invoke('printers:get'),
  setDefault: (printerName) => ipcRenderer.invoke('printer:setDefault', printerName),
  getDefault: () => ipcRenderer.invoke('printer:getDefault'),
  print: (htmlContent) => ipcRenderer.invoke('printer:print', htmlContent),
});

contextBridge.exposeInMainWorld('settingsAPI', {
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),
  getSetting: (key) => ipcRenderer.invoke('settings:get', key),
});

contextBridge.exposeInMainWorld('appAPI', {
  reloadToMain: () => ipcRenderer.invoke('app:reloadToMain')
});

contextBridge.exposeInMainWorld('appPath', {
  getBasePath: () => path.join(__dirname),
});