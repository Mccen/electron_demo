const { app, ipcMain } = require('electron')
const db = require('./connect.js') // 数据库模块
const loader = require('./pageLoader.js') // 页面加载器
let showusername = 'unknown'

app.on('ready', () => {
  loader.init('../webpack/html/login.html')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // 修复拼写错误
    app.quit()
  }
})

// IPC 通信处理
ipcMain.handle('check-username', async (_, username) => {
  return new Promise((resolve, reject) => {
    db.checkUsernameExists(username, (err, isAvailable) => {
      err ? reject(err) : resolve(isAvailable)
    })
  })
})

ipcMain.handle('authenticate-user', async (_, username, password) => {
  return new Promise((resolve, reject) => {
    db.authenticateUser(username, password, (err, isAuthenticated) => {
      err ? reject(err) : resolve(isAuthenticated)
    })
  })
})

ipcMain.handle('register-user', async (_, username, password) => {
  return new Promise((resolve, reject) => {
    db.registerUser(username, password, (err, isRegistered) => {
      err ? reject(err) : resolve(isRegistered)
    })
  })
})

ipcMain.handle('get-user-id', async () => {
  return new Promise((resolve, reject) => {
    db.getUserIdByUsername(showusername, (err, userId) => {
      err ? reject(err) : resolve(userId)
    })
  })
})

ipcMain.handle('get-device-list-by-user-id', async (_, userId) => {
  return new Promise((resolve, reject) => {
    db.getDeviceListByUserId(userId, (err, devices) => {
      err ? reject(err) : resolve(devices)
    })
  })
})

ipcMain.handle('add-device', async (_, userId, deviceName) => {
  return new Promise((resolve, reject) => {
    db.addDevice(userId, deviceName, (err, added) => {
      err ? reject(err) : resolve(added)
    })
  })
})

ipcMain.handle('remove-device', async (_, deviceId) => {
  return new Promise((resolve, reject) => {
    db.removeDevice(deviceId, (err, removed) => {
      err ? reject(err) : resolve(removed)
    })
  })
})

ipcMain.handle('update-device', async (_, deviceId, newDeviceName) => {
  return new Promise((resolve, reject) => {
    db.updateDevice(deviceId, newDeviceName, (err, updated) => {
      err ? reject(err) : resolve(updated)
    })
  })
})
ipcMain.handle('check-device-name', async (_, userId, deviceName) => {
	return new Promise((resolve, reject) => {
	  db.checkDeviceNameExists(userId, deviceName, (err, exists) => {
		err ? reject(err) : resolve(exists);
	  });
	});
  });
// 事件监听
ipcMain.on('close-init', () => loader.closeInit())
ipcMain.on('close-main', () => loader.closeMain())

ipcMain.on('login-successful', (_, username) => {
  showusername = username
  loader.closeInit()
  loader.createWindow('../webpack/html/index.html')
})

ipcMain.on('navigate-to-login', () => {
  loader.initLoadPage('../webpack/html/login.html')
})

ipcMain.on('registration-successful', () => {
  loader.initLoadPage('../webpack/html/login.html')
})

ipcMain.on('navigate-to-register', () => {
  loader.initLoadPage('../webpack/html/register.html')
})

// 同步返回用户名
ipcMain.handle('get-username', () => showusername)