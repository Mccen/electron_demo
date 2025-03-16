const { app, ipcMain, globalShortcut } = require('electron');
const db = require('./connect.js'); // 数据库模块
const loader = require('./pageLoader.js'); // 页面加载器

var userInfo = {
  username: 'unknown',
  uid: 0,
  role: 'null'
};

app.on('ready', () => {
  loader.createInit('../webpack/html/login.html');
  // loader.createWindow('../webpack/html/index.html');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC 通信处理
ipcMain.handle('check-username', async (_, username) => {
  return new Promise((resolve, reject) => {
    db.checkUsernameExists(username, (err, exits) => {
      err ? reject(err) : resolve(!exits);
    });
  });
});

ipcMain.handle('authenticate-user', async (_, username, password) => {
  return new Promise((resolve, reject) => {
    db.authenticateUser(username, password, (err, isAuthenticated) => {
      if (err) {
        reject(err);
      } else if (isAuthenticated) {
        // 这里假设数据库中有一个获取用户角色的方法
        db.getUserRoleByUsername(username, (err, result) => {
          if (err) {
            reject(err);
          } else {
            const user = result[0] || {}; 
            if (user.username && user.uid && user.role) {
              userInfo.username = user.username; 
              userInfo.uid = user.uid; 
              userInfo.role = user.role; 
              console.log('更新后的 userInfo:', userInfo);
            } else {
              console.error('数据库返回的用户信息格式错误:', result);
            }
            resolve(isAuthenticated);
          }
        });
      } else {
        // 当认证失败时，也要调用 resolve 方法
        resolve(isAuthenticated);
      }
    });
  });
});

ipcMain.handle('register-user', async (_, username, password) => {
  return new Promise((resolve, reject) => {
    db.registerUser(username, password, (err, isRegistered) => {
      err ? reject(err) : resolve(isRegistered);
    });
  });
});

ipcMain.handle('get-device-list-by-uid', async (_, uid) => {
  return new Promise((resolve, reject) => {
    db.getDeviceListByUid(uid, (err, devices) => {
      err ? reject(err) : resolve(devices);
    });
  });
});

ipcMain.handle('get-humidity-data-by-device', async (_, did) => {
  return new Promise((resolve, reject) => {
    db.getHumidityDataByDevice(did, (err, humidityData) => {
      err ? reject(err) : resolve(humidityData);
    });
  });
});

ipcMain.handle('get-temperature-data-by-device', async (_, did) => {
  return new Promise((resolve, reject) => {
    db.getTemperatureDataByDevice(did, (err, temperatureData) => {
      err ? reject(err) : resolve(temperatureData);
    });
  });
});

ipcMain.handle('get-alarm-data-by-device', async (_, did) => {
  return new Promise((resolve, reject) => {
    db.getAlarmDataByDevice(did, (err, alarmData) => {
      err ? reject(err) : resolve(alarmData);
    });
  });
});
// 开放用户信息给渲染进程
ipcMain.handle('get-user-info', () => {
    return userInfo;
});

// 事件监听
ipcMain.on('close-init', () => loader.closeInit());
ipcMain.on('close-main', () => loader.closeMain());
ipcMain.on('open-panel', () => {
  loader.createPanel('../webpack/html/panel.html');
  // 注册 Esc 键全局快捷键（仅当 Panel 存在时生效）
  globalShortcut.register('Escape', () => {
    loader.closePanel();
    globalShortcut.unregister('Escape');
  });
});

ipcMain.on('login-successful', () => {
  loader.closeInit();
  loader.createWindow('../webpack/html/index.html');
});

ipcMain.on('navigate-to-login', () => {
  loader.initLoadPage('../webpack/html/login.html');
});

ipcMain.on('registration-successful', () => {
  loader.initLoadPage('../webpack/html/login.html');
});

ipcMain.on('navigate-to-register', () => {
  loader.initLoadPage('../webpack/html/register.html');
});
