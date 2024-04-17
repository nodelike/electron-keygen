const usbDriveSelect = document.getElementById('usbDriveSelect');
const serialNumberEl = document.getElementById('serialNumber');
const manufacturerEl = document.getElementById('manufacturer');
const generateBtn = document.getElementById('generateBtn');
const resultEl = document.getElementById('result');

async function populateUSBDrives() {
  const connectedDrives = await window.api.getConnectedUSBDrives();
  usbDriveSelect.innerHTML = connectedDrives.map(drive => `<option value="${drive.deviceAddress}">${drive.deviceName}</option>`).join('');
  generateBtn.disabled = connectedDrives.length === 0;
  updateSerialNumber();
}

async function updateSerialNumber() {
  const selectedDeviceId = usbDriveSelect.value;
  const details = await window.api.getUsbDetails(selectedDeviceId);
  serialNumberEl.textContent = `${details.serialNumber}`;
  manufacturerEl.textContent = `${details.manufacturer}`; 
}

populateUSBDrives();

usbDriveSelect.addEventListener('change', updateSerialNumber);

generateBtn.addEventListener('click', async () => {
  const selectedDeviceId = usbDriveSelect.value;
  const details = await window.api.getUsbDetails(selectedDeviceId);
  const salt = 'hello';
  const licenseKey = await generateLicenseKey(details.serialNumber, salt);
  await window.api.downloadLicenseKey(licenseKey);
  resultEl.textContent = 'Hardware lock generated successfully!';
});

async function generateLicenseKey(serialNumber, salt) {
  const data = serialNumber + salt;
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const digest = await window.crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(digest));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

window.api.onUsbDeviceChanged((devices) => {
  populateUSBDrives(devices);
});