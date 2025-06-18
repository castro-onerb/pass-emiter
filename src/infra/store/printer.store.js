import Store from 'electron-store';

const printerStore = new Store({
  name: 'printer.config',
  defaults: {
    defaultPrinter: null
  }
});

export default printerStore;
