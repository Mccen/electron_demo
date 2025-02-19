const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('myAPI', {
  sendLoginSuccessful: (username) => ipcRenderer.send('login-successful', username),
  navigateToLogin: () => ipcRenderer.send('navigate-to-login'),
  registrationSuccessful: () => ipcRenderer.send('registration-successful'),
  navigateToRegister: () => ipcRenderer.send('navigate-to-register'),
  closeInit: () => ipcRenderer.send('close-init'),
  closeMain: () => ipcRenderer.send('close-main'),


  getUserId: () => ipcRenderer.invoke('get-user-id'),
  checkUsername: (username) => ipcRenderer.invoke('check-username', username),
  authenticateUser: (username, password) => ipcRenderer.invoke('authenticate-user', username, password),
  registerUser: (username, password) => ipcRenderer.invoke('register-user', username, password),
  getUsername: () => ipcRenderer.invoke('get-username'),
  getDeviceListByUserId: (userId) => ipcRenderer.invoke('get-device-list-by-user-id', userId),
  addDevice: (userId, deviceName) => ipcRenderer.invoke('add-device', userId, deviceName),
  removeDevice: (deviceId) => ipcRenderer.invoke('remove-device', deviceId),
  updateDevice: (deviceId, newDeviceName) => ipcRenderer.invoke('update-device', deviceId, newDeviceName),
  checkDeviceName: (userId, deviceName) => ipcRenderer.invoke('check-device-name', userId, deviceName),
});
