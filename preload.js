const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getConnectedUSBDrives: async () => {
    return await ipcRenderer.invoke('get-connected-usb-drives');
  },
  getSerialNumber: async (portPath) => {
    return await ipcRenderer.invoke('get-serial-number', portPath);
  },
  validateSerialNumber: async (serialNumber, validKeys) => {
    return await ipcRenderer.invoke('validate-serial-number', serialNumber, validKeys);
  }
});