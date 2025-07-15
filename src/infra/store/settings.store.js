import Store from 'electron-store';

const Settings = new Store({
  schema: {
    isConfigured: {
      type: 'boolean',
      default: false
    },
    defaultPrinter: {
      type: 'string',
      default: ''
    },
    fila_id: {
      type: 'number',
      default: 79
    }
  }
});

export default Settings;
