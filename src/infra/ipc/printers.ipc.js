import { BrowserWindow, ipcMain } from 'electron';
import Settings from '../store/settings.store.js';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { execSync } from 'child_process';

export function registerPrinters(win) {
  ipcMain.handle('printers:get', async () => {
    return await win.webContents.getPrintersAsync();
  });

  ipcMain.handle('printer:setDefault', (_, printerName) => {
    Settings.set('defaultPrinter', printerName);
    return { success: true };
  });

  ipcMain.handle('printer:getDefault', () => {
    return Settings.get('defaultPrinter');
  });

  // ipcMain.handle('printer:print', async (_, htmlContent) => {
  //   const printerName = Settings.get('defaultPrinter');
  //   if (!printerName) {
  //     throw new Error('Impressora padrão não configurada');
  //   }

  //   return new Promise((resolve, reject) => {
  //     const printWin = new BrowserWindow({
  //       show: false,
  //       webPreferences: { offscreen: false }
  //     });

  //     printWin.webContents.once('did-finish-load', () => {

  //       printWin.webContents.print({
  //         silent: true,
  //         deviceName: printerName,
  //         printBackground: true
  //       }, (success, errorType) => {
  //         printWin.close();
  //         if (!success) {
  //           printWin.destroy();
  //           reject(new Error(errorType));
  //         } else {
  //           printWin.destroy();
  //           resolve('Impressão enviada com sucesso');
  //         }
  //       });
  //     });

  //     printWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
  //   });
  // });

  ipcMain.handle('printer:print', async (_, htmlContent) => {
    const printerName = Settings.get('defaultPrinter');
    if (!printerName) throw new Error('Impressora padrão não configurada');

    const dpi = 201;
    const mmToInches = mm => mm / 25.4;

    const paperWidthMM = 65;
    const paperHeightMM = 200;

    const paperWidthPx = Math.round(mmToInches(paperWidthMM) * dpi);
    const paperHeightPx = Math.round(mmToInches(paperHeightMM) * dpi);

    console.log('Window size for 201dpi rendering:', paperWidthPx, paperHeightPx);

    const printWin = new BrowserWindow({
      show: false,
      width: paperWidthPx,
      height: paperHeightPx,
      webPreferences: { offscreen: false }
    });

    await printWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
    await printWin.webContents.setZoomFactor(1.0);

    const pdfData = await printWin.webContents.printToPDF({
      printBackground: true,
      scaleFactor: 2
    });

    await printWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
    await printWin.webContents.setZoomFactor(2);

    const tmpDir = os.tmpdir();
    const pdfPath = path.join(tmpDir, 'ticket.pdf');
    fs.writeFileSync(pdfPath, pdfData);
    console.log('PDF gerado em:', pdfPath);

    const isLinux = process.platform === 'linux';

    if (isLinux) {
      return new Promise((resolve, reject) => {
        printWin.webContents.print({
          silent: true,
          deviceName: printerName,
          printBackground: true
        }, (success, errorType) => {
          printWin.destroy();
          if (!success) reject(new Error(errorType));
          else resolve('Impressão enviada com sucesso');
        });
      });
      // execSync(`lp -d ${printerName} -o scaling=100 -o fit-to-page=false -o fitplot=false ${pdfPath}`);
      // printWin.destroy();
      // return 'Impressão enviada via PDF no Linux';
    } else {
      return new Promise((resolve, reject) => {
        printWin.webContents.print({
          silent: true,
          deviceName: printerName,
          printBackground: true
        }, (success, errorType) => {
          printWin.destroy();
          if (!success) reject(new Error(errorType));
          else resolve('Impressão enviada com sucesso');
        });
      });
    }
  });
}
