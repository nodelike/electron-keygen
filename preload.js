const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getConnectedUSBDrives: () => ipcRenderer.invoke('get-connected-usb-drives'),
  getSerialNumber: (deviceId) => ipcRenderer.invoke('get-serial-number', deviceId),
  validateSerialNumber: (serialNumber, validKeys) => ipcRenderer.invoke('validate-serial-number', serialNumber, validKeys),
});