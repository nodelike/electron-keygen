const validKeys = ['ABC123', 'DEF456', 'GHI789']; // Replace with your valid serial number keys
const usbDriveSelect = document.getElementById('usbDriveSelect');
const serialNumberEl = document.getElementById('serialNumber');
const authenticateBtn = document.getElementById('authenticateBtn');
const resultEl = document.getElementById('result');

async function populateUSBDrives() {
  const connectedDrives = await window.api.getConnectedUSBDrives();
  usbDriveSelect.innerHTML = connectedDrives.map(drive => `<option value="${drive.deviceAddress}">${drive.deviceName}</option>`).join('');
  authenticateBtn.disabled = connectedDrives.length === 0;
  updateSerialNumber(); // Call updateSerialNumber after populating the USB drives
}

async function updateSerialNumber() {
  const selectedDeviceId = usbDriveSelect.value;
  const serialNumber = await window.api.getSerialNumber(selectedDeviceId);
  serialNumberEl.textContent = `Serial Number: ${serialNumber}`;
}

populateUSBDrives();

usbDriveSelect.addEventListener('change', updateSerialNumber);

authenticateBtn.addEventListener('click', async () => {
  const selectedDeviceId = usbDriveSelect.value;
  const serialNumber = await window.api.getSerialNumber(selectedDeviceId);
  const isValid = await window.api.validateSerialNumber(serialNumber, validKeys);
  if (isValid) {
    resultEl.textContent = 'Authentication successful!';
  } else {
    resultEl.textContent = 'Invalid serial number.';
  }
});