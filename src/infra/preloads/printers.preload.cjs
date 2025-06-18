const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('printerAPI', {
  getPrinters: () => ipcRenderer.invoke('printers:get'),
  setDefault: (printerName) => ipcRenderer.invoke('printer:setDefault', printerName),
  getDefault: () => ipcRenderer.invoke('printer:getDefault'),
  print: (htmlContent) => ipcRenderer.invoke('printer:print', htmlContent)
});
