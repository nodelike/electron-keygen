const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getConnectedUSBDrives: () => ipcRenderer.invoke('get-connected-usb-drives'),
  getUsbDetails: (deviceId) => ipcRenderer.invoke('get-usb-detials', deviceId),
  downloadLicenseKey: (licenseKey) => ipcRenderer.invoke('download-license-key', licenseKey),
  onUsbDeviceChanged: (callback) => ipcRenderer.on('usb-device-changed', (event, devices) => callback(devices)),
});