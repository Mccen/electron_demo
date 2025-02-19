const mysql = require('mysql2');
const mqtt = require('mqtt');
const fs = require('fs'); // 引入fs模块
const { v4: uuidv4 } = require('uuid'); // 导入 uuid v4 生成器
const bcrypt = require('bcrypt');

// 读取配置文件
let config;
try {
  const configFilePath = './config.json'; // 假设配置文件与脚本在同一目录下
  const rawConfig = fs.readFileSync(configFilePath);
  config = JSON.parse(rawConfig);
} catch (e) {
  console.error('Error reading or parsing config file:', e);
  process.exit(1); // 如果无法读取或解析配置文件，则退出进程
}
// 创建连接
let connection;
try {
  connection = mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
  });

  console.log('Attempting to connect to the database...');
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to database:', err);
    } else {
      console.log('Connected to the database.');
    }
  });
} catch (e) {
  console.error('Error creating connection:', e);
}

module.exports = {
  authenticateUser: (username, password, callback) => {
    const sql = 'SELECT * FROM user WHERE Username = ?';
    connection.execute(sql, [username], async (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return callback(err, null);
      }

      const user = results[0];
      if (!user) {
        return callback(null, false); // 用户名不存在
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.Password);
      callback(null, isPasswordValid);
    });
  },
  registerUser: (username, password, callback) => {
    // 检查用户名是否已存在
    const checkSql = 'SELECT * FROM user WHERE Username = ?';
    connection.execute(checkSql, [username], async (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return callback(err, false);
      }

      if (results.length > 0) {
        return callback(null, false); // 用户名已存在
      }

      // 生成哈希密码
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const userId = uuidv4(); // 生成 UUID
      const insertSql = 'INSERT INTO user (UserID, Username, Password) VALUES (?, ?, ?)';
      connection.execute(insertSql, [userId, username, hashedPassword], (err, results) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          return callback(err, false);
        }
        callback(null, true);
      });
    });
  },
  checkUsernameExists: (username, callback) => {
    const sql = 'SELECT * FROM user WHERE Username = ?';
    connection.execute(sql, [username], (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return callback(err, null);
      }
      callback(null, results.length === 0); // true 表示用户名可用
    });
  },
  getUserIdByUsername: (username, callback) => {
    const sql = 'SELECT UserID FROM user WHERE Username = ?';
    connection.execute(sql, [username], (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return callback(err, null);
      }
      callback(null, results[0]?.UserID);
    });
  },
  getDeviceListByUserId: (userId, callback) => {
    const sql = 'SELECT DeviceID, DeviceName FROM device WHERE UserID = ?';
    connection.execute(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return callback(err, null);
      }
      console.log('Devices fetched:', results); // 添加调试信息
      callback(null, results);
    });
  },
  addDevice: (userId, deviceName, callback) => {
    const deviceId = uuidv4(); // 生成 UUID
    const sql = 'INSERT INTO device (DeviceID, DeviceName, UserID) VALUES (?, ?, ?)';
    connection.execute(sql, [deviceId, deviceName, userId], (err, results) => {
      if (err) {
        console.error('Error adding device:', err);
        return callback(err, false);
      }
      callback(null, true);
    });
  },
  removeDevice: (deviceId, callback) => {
    const sql = 'DELETE FROM device WHERE DeviceID = ?';
    connection.execute(sql, [deviceId], (err, results) => {
      if (err) {
        console.error('Error removing device:', err);
        return callback(err, false);
      }
      callback(null, true);
    });
  },
  updateDevice: (deviceId, newDeviceName, callback) => {
    const sql = 'UPDATE device SET DeviceName = ? WHERE DeviceID = ?';
    connection.execute(sql, [newDeviceName, deviceId], (err, results) => {
      if (err) {
        console.error('Error updating device:', err);
        return callback(err, false);
      }
      callback(null, true);
    });
  },
  checkDeviceNameExists: (userId, deviceName, callback) => {
    const sql = 'SELECT COUNT(*) AS count FROM device WHERE UserID = ? AND DeviceName = ?';
    connection.execute(sql, [userId, deviceName], (err, results) => {
      if (err) {
        console.error('Error checking device name:', err);
        return callback(err, null);
      }
      callback(null, results[0].count > 0);
    });
  }
};
