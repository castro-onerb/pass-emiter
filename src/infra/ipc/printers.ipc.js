import { BrowserWindow, ipcMain } from 'electron';
import printerStore from '../store/printer.store.js';

export function registerPrinters(win) {
  ipcMain.handle('printers:get', async () => {
    return await win.webContents.getPrintersAsync();
  });

  ipcMain.handle('printer:setDefault', (_, printerName) => {
    printerStore.set('defaultPrinter', printerName);
    return { success: true };
  });

  ipcMain.handle('printer:getDefault', () => {
    return printerStore.get('defaultPrinter');
  });

  ipcMain.handle('printer:print', async (_, htmlContent) => {
    const printerName = printerStore.get('defaultPrinter');
    if (!printerName) {
      throw new Error('Impressora padrão não configurada');
    }

    const printWin = new BrowserWindow({
      show: true,
      webPreferences: { offscreen: false }
    });

    await printWin.loadURL(`data:text;charset=utf-8,${encodeURIComponent(htmlContent)}`);

    return new Promise((resolve, reject) => {
      console.log('ok aqui 3');
      printWin.webContents.once('did-finish-load', () => {
        printWin.webContents.print({
          silent: false,
          deviceName: printerName,
          printBackground: true
        }, (success, errorType) => {
          console.log('ok aqui 3');
          if (!success) {
            reject(new Error(errorType));
          } else {
            resolve('Impressão enviada com sucesso');
          }
          printWin.close();
        });
      });

    });
  });
}
