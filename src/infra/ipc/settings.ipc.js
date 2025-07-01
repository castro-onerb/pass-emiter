import { ipcMain } from 'electron';
import Settings from '../store/settings.store.js';

export function registerSettingsIpc() {
  ipcMain.handle('settings:save', (_, data) => {
    for (const [key, value] of Object.entries(data)) {
      Settings.set(key, value);
    }
    return { success: true };
  });

  ipcMain.handle('settings:get', (_, key) => {
    return Settings.get(key);
  });
}
