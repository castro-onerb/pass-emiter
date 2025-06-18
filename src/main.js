import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerAllIpc } from './infra/ipc/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createMainWindow = async () => {
  const win = new BrowserWindow({
    fullscreen: true,
    disableAutoHideCursor: false,
    resizable: false,
    autoHideMenuBar: true,
    kiosk: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'infra/preloads/printers.preload.cjs'),
    }
  });

  win.loadFile(path.join(__dirname, 'app/views/config.html'));

  registerAllIpc(win);
};

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  console.log('Todas as janelas fechadas');
  BrowserWindow.getAllWindows().forEach(win => {
    console.log('Janela ainda ativa:', win.title);
  });

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
