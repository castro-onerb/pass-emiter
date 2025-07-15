import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerAllIpc } from './infra/ipc/index.js';
import Settings from './infra/store/settings.store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

const REQUIRED_SETTINGS = ['defaultPrinter', 'fila_id'];

function isAppConfigured() {
  return REQUIRED_SETTINGS.every((key) => {
    const value = Settings.get(key);
    return value !== undefined && value !== null && value !== '';
  });
}

const createMainWindow = async () => {
  const isConfigured = isAppConfigured();

  mainWindow = new BrowserWindow({
    fullscreen: false,
    disableAutoHideCursor: false,
    resizable: true,
    autoHideMenuBar: false,
    kiosk: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'infra/preloads/main.preload.cjs'),
      sandbox: false,
    }
  });

  const pageToLoad = isConfigured
    ? 'index.html'
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
