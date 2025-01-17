const { BrowserWindow, screen } = require('electron');
const path = require('path');
let mainWindow, initWindow;
module.exports = {
    init,
    createWindow,
    initLoadPage,
    mainLoadPage,
    closeInit,
    closeMain
};
function init(url) {
    // 确定窗口的大小
    let windowWidth = 600;
    let windowHeight = 500;
    // 获取屏幕的尺寸
    let displays = screen.getAllDisplays();
    let primaryDisplay = displays[0]; // 通常使用主屏幕，你也可以根据需要选择其他屏幕
    let screenWidth = primaryDisplay.workArea.width;
    let screenHeight = primaryDisplay.workArea.height;
    // 计算窗口的中心位置
    let x = (screenWidth - windowWidth) / 2;
    let y = (screenHeight - windowHeight) / 2;
    initWindow = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        x: x,
        y: y,
        resizable: false,
        frame: false, // 去除边框
        transparent: true,
        autoHideMenuBar: true, // 自动隐藏菜单栏
        webPreferences: {
            nodeIntegration: false,       // 禁用 Node.js 集成
            contextIsolation: true,     // 启用上下文隔离
            preload: path.join(__dirname, 'preload.js') // 使用预加载脚本
        }
    });
    initWindow.loadFile(path.join(__dirname, url));
    // 监听页面加载完成事件
    initWindow.webContents.on('did-finish-load', () => {
        initWindow.webContents.send('page-loaded');
    });
}

function createWindow(url) {
    // 确定窗口的大小
    let windowWidth = 1280;
    let windowHeight = 720;
    // 获取屏幕的尺寸
    let displays = screen.getAllDisplays();
    let primaryDisplay = displays[0]; // 通常使用主屏幕，你也可以根据需要选择其他屏幕
    let screenWidth = primaryDisplay.workArea.width;
    let screenHeight = primaryDisplay.workArea.height;
    // 计算窗口的中心位置
    let x = (screenWidth - windowWidth) / 2;
    let y = (screenHeight - windowHeight) / 2;
    mainWindow = new BrowserWindow({
        x: x,
        y: y,
        width: windowWidth,
        height: windowHeight,
        frame: false, // 去除边框
        transparent: true,
        autoHideMenuBar: true, // 自动隐藏菜单栏
        webPreferences: {
            nodeIntegration: true,       // 启用 Node.js 集成
            contextIsolation: true,     // 启用上下文隔离
            preload: path.join(__dirname, 'preload.js') // 使用预加载脚本
        }
    });
    mainWindow.loadFile(path.join(__dirname, url));
    // 监听页面加载完成事件
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('page-loaded');
    });
}
function initLoadPage(url) {
    initWindow.loadFile(path.join(__dirname, url));
}
function mainLoadPage(url) {
    mainWindow.loadFile(path.join(__dirname, url));
}
function closeInit() {
    initWindow.close();
}
function closeMain() {
    mainWindow.close();
}