const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const SerialPort = require('serialport');
const list = SerialPort.list;
const Readline = require('@serialport/parser-readline');

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
  const ports = await list();
  const usbDrives = [];

  for (const port of ports) {
    const parser = new Readline();
    const portObj = new SerialPort(port.comName, { baudRate: 9600 });
    portObj.pipe(parser);

    portObj.on('open', () => {
      portObj.write('get_usb_name');
    });

    let usbName = null;
    parser.on('data', (data) => {
      usbName = data.toString().trim();
      portObj.close();
    });

    await new Promise(resolve => portObj.on('close', resolve));

    if (usbName) {
      usbDrives.push({ path: port.comName, name: usbName });
    }
  }

  return usbDrives;
});


ipcMain.handle('get-serial-number', async (event, portPath) => {
  const port = new SerialPort(portPath, { baudRate: 9600 });

  port.on('open', () => {
    port.write('get_serial_number');
  });

  let serialNumber = null;
  port.on('data', (data) => {
    serialNumber = data.toString().trim();
    port.close();
  });

  await new Promise(resolve => port.on('close', resolve));

  return serialNumber;
});

ipcMain.handle('validate-serial-number', (event, serialNumber, validKeys) => {
  return validKeys.includes(serialNumber);
});
