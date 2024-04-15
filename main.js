const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const usbDetect = require('usb-detection');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('get-connected-usb-drives', async () => {
  try {
    const devices = await usbDetect.find();
    const usbDrives = devices.filter(device => {
      return device.deviceName.toLowerCase().includes('mass storage') ||
             device.deviceName.toLowerCase().includes('usb drive') ||
             device.deviceName.toLowerCase().includes('usb disk');
    });
    console.log('Connected USB drives:', usbDrives);
    return usbDrives;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
});

ipcMain.handle('get-serial-number', async (event, deviceAddress) => {
  try {
    const devices = await usbDetect.find();
    const device = devices.find(dev => dev.deviceAddress === parseInt(deviceAddress));
    console.log('Selected device:', device);
    if (device && device.serialNumber) {
      return device.serialNumber;
    } else {
      return 'Serial Number Not Available';
    }
  } catch (error) {
    console.error('Error:', error);
    return 'Serial Number Not Available';
  }
});

ipcMain.handle('validate-serial-number', (event, serialNumber, validKeys) => {
  return validKeys.includes(serialNumber);
});