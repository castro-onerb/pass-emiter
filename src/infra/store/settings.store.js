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
    }
  }
});

export default Settings;
