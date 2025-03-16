const mysql = require('mysql2');
const fs = require('fs');
const crypto = require('crypto');
const { default: mqtt } = require('mqtt');

// 读取配置文件
let config;
try {
    const configFilePath = './config.json';
    const rawConfig = fs.readFileSync(configFilePath);
    config = JSON.parse(rawConfig);
} catch (e) {
    console.error('Error reading or parsing config file:', e);
    process.exit(1);
}

// 创建连接
let sqlconnection,mqttconnection;
try {
    sqlconnection = mysql.createConnection({
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database
    });
    console.log('Attempting to connect to the database...');
    sqlconnection.connect(err => {
        if (err) {
            console.error('Error connecting to database:', err);
        } else {
            console.log('Connected to the database.');
        }
    });
} catch (e) {
    console.error('Error creating sqlconnection:', e);
}
// try{
//     mqttconnection = mqtt.connect({
//         host: config.mqtt.host,
//         port: config.mqtt.port
//     });
// }
// catch (e) {
//     console.error('Error creating sqlconnection:', e);
// }
// 生成 MD5 哈希
function generateMD5Hash(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

module.exports = {
    // 检查用户名是否存在
    checkUsernameExists: (username, callback) => {
        const sql = 'SELECT * FROM user WHERE username = ?';
        sqlconnection.execute(sql, [username], (err, results) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return callback(err, null);
            }
            callback(null, results.length > 0);
        });
    },
    // 验证账号密码
    authenticateUser: (username, password, callback) => {
        const sql = 'SELECT * FROM user WHERE username = ?';
        const hashedPassword = generateMD5Hash(password);
        sqlconnection.execute(sql, [username], (err, results) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return callback(err, null);
            }

            const user = results[0];
            if (!user) {
                return callback(null, false);
            }

            const isPasswordValid = hashedPassword === user.password;
            callback(null, isPasswordValid);
        });
    },
    // 注册
    registerUser: (username, password, callback) => {
      module.exports.checkUsernameExists(username, (err, exists) => {
            if (err) {
              console.error('Error executing SQL query:', err);
                return callback(err, false);
            }
            if (exists) {
                console.log('Username already exists.');
                return callback(null, false);
            }

            const hashedPassword = generateMD5Hash(password);
            const insertSql = 'INSERT INTO user (username, password ,role) VALUES (?, ?, ?)';
            sqlconnection.execute(insertSql, [username, hashedPassword, 'user'], (err, results) => {
                if (err) {
                    console.error('Error executing SQL query:', err);
                    return callback(err, false);
                }
                callback(null, true);
            });
        });
    },
    // 根据 uid 拉取设备列表
    getDeviceListByUid: (uid, callback) => {
        const sql = 'SELECT * FROM device WHERE uid = ?';
        sqlconnection.execute(sql, [uid], (err, results) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    // 根据设备拉取湿度信息
    getHumidityDataByDevice: (did, callback) => {
        const sql = 'SELECT * FROM shidu WHERE did = ?';
        sqlconnection.execute(sql, [did], (err, results) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    // 根据设备拉取温度信息
    getTemperatureDataByDevice: (did, callback) => {
        const sql = 'SELECT * FROM wendu WHERE did = ?';
        sqlconnection.execute(sql, [did], (err, results) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    // 根据设备拉取警报信息
    getAlarmDataByDevice: (did, callback) => {
        const sql = 'SELECT did,alarm_type,alarm_time FROM alarm WHERE did = ?';
        sqlconnection.execute(sql, [did], (err, results) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    getUserRoleByUsername: (username, callback) => {
      const sql = 'SELECT username,uid,role FROM user WHERE username = ?';
      sqlconnection.execute(sql, [username], (err, results) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          return callback(err, null);
        }
        callback(null, results);
      });
    },
    
};
    