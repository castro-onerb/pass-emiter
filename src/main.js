import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerAllIpc } from './infra/ipc/index.js';
import Settings from './infra/store/settings.store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

const createMainWindow = async () => {
  const isConfigured = Settings.get('isConfigured') === true;

  mainWindow = new BrowserWindow({
    fullscreen: true,
    disableAutoHideCursor: false,
    resizable: false,
    autoHideMenuBar: true,
    kiosk: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'infra/preloads/main.preload.cjs'),
      sandbox: false,
    }
  });

  const pageToLoad = isConfigured
    ? 'index2.html'
    : 'config.html';

  registerAllIpc(mainWindow, __dirname);
  await mainWindow.loadFile(path.join(__dirname, `app/views/${pageToLoad}`));
};

const openConfigWindow = () => {
  if (mainWindow) {
    mainWindow.loadFile(path.join(__dirname, 'app/views/config.html'));
  }
};

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  createMainWindow();

  globalShortcut.register('Control+Shift+C', () => {
    openConfigWindow();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  BrowserWindow.getAllWindows().forEach(win => {
    if (!win.isDestroyed()) win.destroy();
  });

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  app.quit();
});
