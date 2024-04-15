const { validateLicenseKey } = window.electron;
const usbDeviceSelect = document.getElementById('usbDeviceSelect');
const selectedUsbDeviceKey = document.getElementById('selectedUsbDeviceKey');
const licenseKeyInput = document.getElementById('licenseKeyInput');
const validateBtn = document.getElementById('validateBtn');

// Populate the dropdown with USB devices
const devices = usb.getDeviceList();
for (const device of devices) {
  const option = document.createElement('option');
  option.value = device.deviceDescriptor.iSerialNumber || 'Unknown Serial Number';
  option.text = option.value;
  usbDeviceSelect.add(option);
}

usbDeviceSelect.addEventListener('change', () => {
  const selectedDevice = usbDeviceSelect.options[usbDeviceSelect.selectedIndex];
  selectedUsbDeviceKey.textContent = selectedDevice.value;
});

validateBtn.addEventListener('click', () => {
  const licenseKey = licenseKeyInput.value;
  if (licenseKey) {
    const serialNumber = validateLicenseKey(licenseKey);
    if (serialNumber) {
      console.log(`Hardware key (serial number): ${serialNumber}`);
    } else {
      console.error('Invalid license key');
    }
  } else {
    console.error('Please enter a license key');
  }
});
