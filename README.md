# Electron Keygen - Hardware lock key generator

### About the software:

Application: **Electron Keygen**

Author: **Kishore Gunalan** - [kishore.blog](https://kishore.blog)

Description: This software makes the license.key file which contains SHA-256 hex of serial number of the selected usb drive.

## How does it work?

### Keygen side:

This software takes in the Serial Number of the selected USB drive.
Ex: `070D2C2044CA3094`

Appends a salt key: `hello`, like this: `070D2C2044CA3094hello`

Hashes the serial number + salt and generates a SHA-256 hex like this: `f2551a2edac6fa16d8321a7fc22ee71664c1098883ae450d2bb8a2c001da597e`

Saves the key in `license.key` file.

### Product/Software side:

User selects the `license.key` file from which we get the hashed SHA-256 hex that looks like this: `f2551a2edac6fa16d8321a7fc22ee71664c1098883ae450d2bb8a2c001da597e`.

We unhash it using the the same hashing algorithm but in reverse from which we'll get the string: `serial number + salt` like this: `070D2C2044CA3094hello`.

We isolate the `serial number` by removing the salt: `hello` which gives us this: `070D2C2044CA3094` and check whether any of the devices that are connected to the computer has the exact `serial number`.

If yes, then its validated.


## Usage

1 . Select the USB device for which you want to create the hardware lock for from the dropdown.

2. Click Generate.

3. Navigate to the folder you want to save the license.key at.

4. Click Save.

## Steps to develop:

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
To be able to start development on electron-keygen, make sure that you have the following prerequisites installed: 

- [Node.js](https://nodejs.org/en)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [git](https://git-scm.com/downloads)

### Installing

Follow this instructions below to build the application:
 
**1. Install Node.js and npm:**

*For Windows/MacOS*:
- Download and install Node.js from [Node.js website](https://nodejs.org/). npm is included in the installation.

- Alternatively, On MacOS, If you have [`Homebrew`](https://brew.sh/) installed, run:
```bash
brew install node npm
```
 
**2. Open the codebase directory:**
```bash
cd electron-keygen
```

**3. Install NPM packages:**
```bash
npm install
```

**4. Start the application:**
```bash
npm start
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
