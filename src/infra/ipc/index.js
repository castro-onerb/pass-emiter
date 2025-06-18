import { registerPrinters } from './printers.ipc.js';

export function registerAllIpc(win) {
  registerPrinters(win);
}
