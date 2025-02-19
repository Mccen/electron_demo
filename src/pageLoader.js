const { BrowserWindow, screen } = require('electron');
const path = require('path');

// 窗口管理器
const windowManager = {
  main: null,
  init: null,

  createWindow(type, options = {}) {
    const displays = screen.getAllDisplays();
    const { workArea } = displays[0];
    
    // 基础配置
    const baseOptions = {
      x: Math.round((workArea.width - options.width) / 2),
      y: Math.round((workArea.height - options.height) / 2),
      webPreferences: {
        contextIsolation: true,    // 必须开启
        sandbox: true,             // 启用沙箱
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,    // 默认禁用
        enableRemoteModule: false, // 禁用远程模块
        ...(options.webPreferences || {}) // 自定义配置
      }
    };

    // 创建窗口实例
    const win = new BrowserWindow({
      ...baseOptions,
      ...options,
      // 保持webPreferences合并结果
      webPreferences: {
        ...baseOptions.webPreferences,
        ...(options.webPreferences || {})
      }
    });

    // 窗口关闭处理
    win.on('closed', () => {
      this[type] = null;
    });

    return win;
  },

  safeClose(windowInstance) {
    if (windowInstance && !windowInstance.isDestroyed()) {
      windowInstance.close();
    }
  }
};

module.exports = {
  init(url) {
    if (windowManager.init) return;
    
    windowManager.init = windowManager.createWindow('init', {
      width: 600,
      height: 500,
      resizable: false,
      frame: false,
      webPreferences: {
        // 特殊情况下允许nodeIntegration
        nodeIntegration: true,
        // 显式指定preload保证加载
        preload: path.join(__dirname, 'preload.js')
      }
    });
    
    this.loadContent(windowManager.init, url);
  },

  createWindow(url) {
    if (windowManager.main) {
      windowManager.main.focus();
      return;
    }

    windowManager.main = windowManager.createWindow('main', {
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      frame: false,
      webPreferences: {
        // 其他窗口保持默认安全设置
        additionalArguments: ['--enable-sandbox']
      }
    });

    this.loadContent(windowManager.main, url);
  },

  loadContent(win, url) {
    if (win && !win.isDestroyed()) {
      const fullPath = path.join(__dirname, url);
      win.loadFile(fullPath)
        .then(() => {
          // 开发模式自动打开调试工具
          if (process.env.NODE_ENV === 'development') {
            win.webContents.openDevTools({ mode: 'detach' });
          }
        })
        .catch(err => {
          console.error(`加载文件失败: ${fullPath}`, err);
          win.webContents.send('load-error', err.message);
        });
    }
  },

  initLoadPage(url) {
    this.loadContent(windowManager.init, url);
  },

  mainLoadPage(url) {
    this.loadContent(windowManager.main, url);
  },

  closeInit() {
    windowManager.safeClose(windowManager.init);
    windowManager.init = null;
  },

  closeMain() {
    windowManager.safeClose(windowManager.main);
    windowManager.main = null;
  }
};