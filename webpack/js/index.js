// ========================
// 常量与DOM引用
// ========================
const DOM = {
  closeBtn: document.getElementById('close-btn'),
  deviceList: document.getElementById('device-list'),
  addDeviceBtn: document.getElementById('add-device-button'),
  usernameDisplay: document.getElementById('showusername')
};

// ========================
// 应用程序状态
// ========================
let appState = {
  userName: '',
  userId: null
};

// ========================
// 初始化入口
// ========================
function initializeApp() {
  try {
    setupEventListeners();
    loadUserData()
      .then(loadDevices)
      .catch(handleGlobalError);
  } catch (error) {
    handleGlobalError(error);
  }
}

// ========================
// 事件监听配置
// ========================
function setupEventListeners() {
  DOM.closeBtn.addEventListener('click', handleCloseApp);
  DOM.addDeviceBtn.addEventListener('click', handleAddDevice);
  DOM.deviceList.addEventListener('click', handleDeviceActions);
}

// ========================
// 事件处理器
// ========================
function handleCloseApp() {
  window.myAPI.closeMain();
}

function handleDeviceActions(event) {
  const target = event.target;
  const deviceItem = target.closest('.device-item');
  if (!deviceItem) return;

  const deviceId = deviceItem.dataset.deviceId;
  const deviceName = deviceItem.querySelector('b').textContent;

  if (target.classList.contains('edit-device')) { // 修正语法错误
    handleEditDevice(deviceId, deviceName);
  } else if (target.classList.contains('remove-device')) { // 修正语法错误
    handleRemoveDevice(deviceId);
  }
}

// ========================
// 核心业务逻辑
// ========================
async function loadUserData() {
  try {
    const [userName, userId] = await Promise.all([
      window.myAPI.getUsername(),
      window.myAPI.getUserId()
    ]);
    
    if (!validateUserData(userName, userId)) {
      throw new Error('Invalid user data');
    }
    
    appState = { userName, userId };
    DOM.usernameDisplay.textContent = userName;
  } catch (error) {
    showNoticeDialog('用户数据加载失败');
    throw error;
  }
}

async function loadDevices() {
  try {
    const devices = await window.myAPI.getDeviceListByUserId(appState.userId);
    renderDeviceList(devices);
  } catch (error) {
    showNoticeDialog('设备列表加载失败');
    throw error;
  }
}

function renderDeviceList(devices) {
  if (!Array.isArray(devices)) {
    throw new TypeError('无效的设备数据格式');
  }

  DOM.deviceList.innerHTML = devices.map(device => `
    <li class="device-item" data-device-id="${escapeHTML(device.DeviceID)}">
      <div class="device-info">
        <b>${escapeHTML(device.DeviceName)}</b>
        </br>
        <span>ID: ${escapeHTML(device.DeviceID)}</span>
      </div>
      <div class="device-actions">
        <button class="edit-device">编辑</button>
        <button class="remove-device">删除</button>
      </div>
    </li>
  `).join('');
}

// ========================
// 设备操作处理（新增校验逻辑）
// ========================
async function handleAddDevice() {
  showInputDialog('请输入新设备名称:', '', async (deviceName) => {
    if (!deviceName) return;

    try {
      // 客户端校验
      const validationError = validateDeviceName(deviceName);
      if (validationError) {
        showNoticeDialog(validationError);
        return;
      }

      // 服务端校验
      const isDuplicate = await window.myAPI.checkDeviceName(appState.userId, deviceName);
      if (isDuplicate) {
        showNoticeDialog('设备名称已存在');
        return;
      }

      const success = await window.myAPI.addDevice(appState.userId, deviceName);
      if (success) {
        await loadDevices();
        showNoticeDialog('设备添加成功');
      }
    } catch (error) {
      handleOperationError('添加设备', error);
    }
  });
}

async function handleEditDevice(deviceId, currentName) {
  showInputDialog('请输入新名称:', currentName, async (newName) => {
    if (!newName || newName === currentName) return;

    try {
      // 客户端校验
      const validationError = validateDeviceName(newName);
      if (validationError) {
        showNoticeDialog(validationError);
        return;
      }

      // 服务端校验（排除当前设备）
      const isDuplicate = await window.myAPI.checkDeviceName(appState.userId, newName);
      if (isDuplicate) {
        showNoticeDialog('设备名称已存在');
        return;
      }

      const success = await window.myAPI.updateDevice(deviceId, newName);
      if (success) {
        await loadDevices();
        showNoticeDialog('设备更新成功');
      }
    } catch (error) {
      handleOperationError('更新设备', error);
    }
  });
}

async function handleRemoveDevice(deviceId) {
  showConfirmDialog('确定要删除此设备吗？', async (confirmed) => {
    if (!confirmed) return;

    try {
      const success = await window.myAPI.removeDevice(deviceId);
      if (success) {
        await loadDevices();
        showNoticeDialog('设备删除成功');
      }
    } catch (error) {
      handleOperationError('删除设备', error);
    }
  });
}

// ========================
// 工具函数（新增校验方法）
// ========================
function validateUserData(userName, userId) {
  return typeof userName === 'string' && userName.length > 0 && userId !== null;
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;')
           .replace(/'/g, '&#39;');
}

function validateDeviceName(name) {
  const MAX_NAME_LENGTH = 20;
  const INVALID_CHARS = /[<>%$#*]/;
  
  if (!name || name.trim().length === 0) {
    return '设备名称不能为空';
  }
  
  if (name.length > MAX_NAME_LENGTH) {
    return `设备名称不能超过${MAX_NAME_LENGTH}个字符`;
  }
  
  if (INVALID_CHARS.test(name)) {
    return '设备名称包含非法字符';
  }
  
  return null;
}

// ========================
// 增强版对话框功能
// ========================
function showNoticeDialog(message, callback) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <p>${message}</p>
      <button class="modal-confirm">确定</button>
    </div>
  `;

  const confirmBtn = modal.querySelector('.modal-confirm');
  confirmBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
    callback?.();
  });

  document.body.appendChild(modal);
  confirmBtn.focus();
}

function showInputDialog(promptMessage, defaultValue, callback) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <p>${promptMessage}</p>
      <input type="text" class="modal-input" value="${escapeHTML(defaultValue)}">
      <div class="error-message" style="color:red;min-height:20px;margin:5px 0"></div>
      <div class="modal-actions">
        <button class="modal-confirm" disabled>确定</button>
        <button class="modal-cancel">取消</button>
      </div>
    </div>
  `;

  const input = modal.querySelector('.modal-input');
  const errorMsg = modal.querySelector('.error-message');
  const confirmBtn = modal.querySelector('.modal-confirm');
  const cancelBtn = modal.querySelector('.modal-cancel');

  let lastCheckId = 0;
  const validate = async () => {
    const checkId = ++lastCheckId;
    const value = input.value.trim();
    
    // 客户端校验
    const validationError = validateDeviceName(value);
    if (validationError) {
      errorMsg.textContent = validationError;
      confirmBtn.disabled = true;
      return;
    }

    // 服务端校验
    try {
      const isDuplicate = await window.myAPI.checkDeviceName(appState.userId, value);
      if (checkId !== lastCheckId) return; // 防止过时响应
      
      errorMsg.textContent = isDuplicate ? '设备名称已存在' : '';
      confirmBtn.disabled = isDuplicate;
    } catch (error) {
      errorMsg.textContent = '校验服务不可用';
      confirmBtn.disabled = true;
    }
  };

  input.addEventListener('input', () => {
    confirmBtn.disabled = true;
    validate();
  });

  validate(); // 初始校验

  const cleanup = () => document.body.removeChild(modal);
  
  confirmBtn.addEventListener('click', () => {
    if (confirmBtn.disabled) return;
    cleanup();
    callback?.(input.value.trim());
  });

  cancelBtn.addEventListener('click', () => {
    cleanup();
    callback?.(null);
  });

  document.body.appendChild(modal);
  input.focus();
}

function showConfirmDialog(message, callback) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <p>${message}</p>
      <div class="modal-actions">
        <button class="modal-confirm">确定</button>
        <button class="modal-cancel">取消</button>
      </div>
    </div>
  `;

  const confirmBtn = modal.querySelector('.modal-confirm');
  const cancelBtn = modal.querySelector('.modal-cancel');

  const cleanup = () => document.body.removeChild(modal);
  
  confirmBtn.addEventListener('click', () => {
    cleanup();
    callback?.(true);
  });

  cancelBtn.addEventListener('click', () => {
    cleanup();
    callback?.(false);
  });

  document.body.appendChild(modal);
  confirmBtn.focus();
}

// ========================
// 错误处理
// ========================
function handleGlobalError(error) {
  console.error('全局错误:', error);
  showNoticeDialog('应用程序发生错误，请重启');
}

function handleOperationError(operation, error) {
  console.error(`${operation}操作失败:`, error);
  showNoticeDialog(`${operation}操作失败，请稍后重试`);
}

// ========================
// 启动应用程序
// ========================
document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('message', (event) => {
  if (event.data === 'page-loaded') initializeApp();
});