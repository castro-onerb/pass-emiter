import { ipcMain } from 'electron';
import path from 'path';
import { registerPrinters } from './printers.ipc.js';
import { registerSettingsIpc } from './settings.ipc.js';


export function registerAllIpc(win, baseDir) {
  registerPrinters(win);
  registerSettingsIpc();

  ipcMain.handle('app:reloadToMain', () => {
    if (win) {
      return win.loadFile(path.join(baseDir, 'app/views/index2.html'));
    }
  });
}
