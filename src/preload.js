const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
    sendLoginSuccessful: () => ipcRenderer.send('login-successful'),
    navigateToLogin: () => ipcRenderer.send('navigate-to-login'),
    registrationSuccessful: () => ipcRenderer.send('registration-successful'),
    navigateToRegister: () => ipcRenderer.send('navigate-to-register'),
    closeInit: () => ipcRenderer.send('close-init'),
    closeMain: () => ipcRenderer.send('close-main'),
    openPanel: () => ipcRenderer.send('open-panel'),


    checkUsername: (username) => ipcRenderer.invoke('check-username', username),
    authenticateUser: (username, password) => ipcRenderer.invoke('authenticate-user', username, password),
    registerUser: (username, password) => ipcRenderer.invoke('register-user', username, password),
    getDeviceListByUid: (uid) => ipcRenderer.invoke('get-device-list-by-uid', uid),
    getHumidityDataByDevice: (did) => ipcRenderer.invoke('get-humidity-data-by-device', did),
    getTemperatureDataByDevice: (did) => ipcRenderer.invoke('get-temperature-data-by-device', did),
    getAlarmDataByDevice: (did) => ipcRenderer.invoke('get-alarm-data-by-device', did),
    getUserInfo: () => ipcRenderer.invoke('get-user-info'),
});
    