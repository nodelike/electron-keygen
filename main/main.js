const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const usbDetect = require('usb-detection');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 650,
    height: 650,
    resizable: false,
    maximizable: false,
    icon: path.join(__dirname, '..', 'assets', 'logo.ico'),
    webPreferences: {
      devTools: false,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'src/index.html'));
  mainWindow.setMenu(null);
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
    const usbDrives = devices.filter(device => device.serialNumber != '');
    return usbDrives;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
});

ipcMain.handle('get-usb-detials', async (event, deviceAddress) => {
  try {
    const devices = await usbDetect.find();
    const device = devices.find(dev => dev.deviceAddress === parseInt(deviceAddress));
    if (device && device.serialNumber) {
      console.log(device);
      return device;
    } else {
      return 'Serial Number Not Available';
    }
  } catch (error) {
    console.error('Error:', error);
    return 'Serial Number Not Available';
  }
});

ipcMain.handle('download-license-key', async (event, licenseKey) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: 'license.key',
    filters: [
      { name: 'Key Files', extensions: ['key'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (filePath) {
    fs.writeFileSync(filePath, licenseKey);
  }
});