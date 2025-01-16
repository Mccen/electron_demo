const { app, ipcMain } = require('electron');
const db = require('./connect.js'); // 引入数据库模块
const loader = require('./pageLoader.js');//引入页面加载器
let showusername = 'unknown';

app.on('ready', function () {
	loader.init('../webpack/html/login.html');

});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// 监听 check-username 请求
ipcMain.handle('check-username', async (event, username) => {
	try {
		return await new Promise((resolve, reject) => {
			db.checkUsernameExists(username, (err, isAvailable) => {
				if (err) {
					reject(err);
				} else {
					resolve(isAvailable); // true 表示用户名可用
				}
			});
		});
	} catch (error) {
		console.error('Error checking username availability:', error);
		throw error;
	}
});

// 监听 authenticate-user 请求
ipcMain.handle('authenticate-user', async (event, username, password) => {
	try {
		return await new Promise((resolve, reject) => {
			db.authenticateUser(username, password, (err, isAuthenticated) => {
				if (err) {
					reject(err);
				} else {
					resolve(isAuthenticated);
				}
			});
		});
	} catch (error) {
		console.error('Error authenticating user:', error);
		throw error;
	}
});

// 监听 register-user 请求
ipcMain.handle('register-user', async (event, username, password) => {
	try {
		return await new Promise((resolve, reject) => {
			db.registerUser(username, password, (err, isRegistered) => {
				if (err) {
					reject(err);
				} else {
					resolve(isRegistered);
				}
			});
		});
	} catch (error) {
		console.error('Error registering user:', error);
		throw error;
	}
});
ipcMain.on('close-init',()=>{
	loader.closeInit();
});
// 监听登录成功的消息
ipcMain.on('login-successful', (event, username) => {
	loader.closeInit();
	showusername = username;
	loader.createWindow('../webpack/html/index.html');
});

// 监听导航到登录页面的消息
ipcMain.on('navigate-to-login', () => {
	loader.initLoadPage('../webpack/html/login.html');
});

// 监听注册成功的消息
ipcMain.on('registration-successful', () => {
	loader.initLoadPage('../webpack/html/login.html');
});

// 监听导航到注册页面的消息
ipcMain.on('navigate-to-register', () => {
	loader.initLoadPage('../webpack/html/register.html');
});

// 获取用户名
ipcMain.handle('get-username', async (event) => {
	try {
		return showusername;
	} catch (error) {
		console.error('Error getting username from variable:', error);
		throw error;
	}
});

// 获取用户ID
ipcMain.handle('get-user-id-by-username', async (event, username) => {
	try {
		return await new Promise((resolve, reject) => {
			db.getUserIdByUsername(username, (err, userId) => {
				if (err) {
					reject(err);
				} else {
					resolve(userId);
				}
			});
		});
	} catch (error) {
		console.error('Error getting user ID by username:', error);
		throw error;
	}
});

// 获取设备列表
ipcMain.handle('get-device-list-by-user-id', async (event, userId) => {
	try {
		return await new Promise((resolve, reject) => {
			db.getDeviceListByUserId(userId, (err, devices) => {
				if (err) {
					reject(err);
				} else {
					resolve(devices);
				}
			});
		});
	} catch (error) {
		console.error('Error getting device list by user ID:', error);
		throw error;
	}
});

// 添加设备
ipcMain.handle('add-device', async (event, userId, deviceName) => {
	try {
		return await new Promise((resolve, reject) => {
			db.addDevice(userId, deviceName, (err, added) => {
				if (err) {
					reject(err);
				} else {
					resolve(added);
				}
			});
		});
	} catch (error) {
		console.error('Error adding device:', error);
		throw error;
	}
});

// 删除设备
ipcMain.handle('remove-device', async (event, deviceId) => {
	try {
		return await new Promise((resolve, reject) => {
			db.removeDevice(deviceId, (err, removed) => {
				if (err) {
					reject(err);
				} else {
					resolve(removed);
				}
			});
		});
	} catch (error) {
		console.error('Error removing device:', error);
		throw error;
	}
});

// 更新设备
ipcMain.handle('update-device', async (event, deviceId, newDeviceName) => {
	try {
		return await new Promise((resolve, reject) => {
			db.updateDevice(deviceId, newDeviceName, (err, updated) => {
				if (err) {
					reject(err);
				} else {
					resolve(updated);
				}
			});
		});
	} catch (error) {
		console.error('Error updating device:', error);
		throw error;
	}
});

