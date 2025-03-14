// ========================
// 常量与DOM引用
// ========================
const DOM = {
  totalCloseBtn: document.getElementById('total-close-btn'),
  deviceList: document.getElementById('device-list'),
  addDeviceBtn: document.getElementById('add-device-button'),
  usernameDisplay: document.getElementById('showusername'),
  openPanelBtn: document.getElementById('open-panel-button')
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
  setupEventListeners();
  loadUserData().then(loadDevices);
}

// ========================
// 事件监听配置
// ========================
function setupEventListeners() {
  DOM.totalCloseBtn?.addEventListener('click', handleCloseApp);
  DOM.addDeviceBtn?.addEventListener('click', handleAddDevice);
  DOM.openPanelBtn?.addEventListener('click', handleOpenPanel);
  
  DOM.deviceList?.addEventListener('click', function(event) {
    const target = event.target;
    const deviceItem = target.closest('.device-item');
    if (!deviceItem) return;

    const deviceId = deviceItem.dataset.deviceId;
    const deviceName = deviceItem.querySelector('b').textContent;

    if (target.classList.contains('edit-device')) {
      handleEditDevice(deviceId, deviceName);
    } else if (target.classList.contains('remove-device')) {
      handleRemoveDevice(deviceId);
    }
  });
}

// ========================
// 基础事件处理器
// ========================
function handleCloseApp() {
  window.myAPI?.closeMain?.();
}

function handleOpenPanel() {
  window.myAPI?.openPanel?.();
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
    
    appState = { userName, userId };
    DOM.usernameDisplay.textContent = userName;
  } catch (error) {
    await showNoticeDialog('错误', '用户数据加载失败');
  }
}

async function loadDevices() {
  try {
    const devices = await window.myAPI.getDeviceListByUserId(appState.userId);
    renderDeviceList(devices);
  } catch (error) {
    await showNoticeDialog('错误', '设备列表加载失败');
  }
}

function renderDeviceList(devices) {
  if (!Array.isArray(devices)) return;
  
  DOM.deviceList.innerHTML = devices.map(device => `
    <li class="device-item" data-device-id="${escapeHTML(device.DeviceID)}">
      <div class="device-info">
        <b>${escapeHTML(device.DeviceName)}</b>
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
// 设备操作处理（完整版）
// ========================
async function handleAddDevice() {
  try {
    const input = await showDialogueDialog('添加设备', '请输入新设备名称:');
    if (!input) return;

    // 客户端验证
    const validationError = validateDeviceName(input);
    if (validationError) {
      await showNoticeDialog('验证失败', validationError);
      return;
    }

    // 服务端查重
    const isDuplicate = await window.myAPI.checkDeviceName(appState.userId, input);
    if (isDuplicate) {
      await showNoticeDialog('操作失败', '设备名称已存在');
      return;
    }

    // 提交数据
    const success = await window.myAPI.addDevice(appState.userId, input);
    if (success) {
      await loadDevices();
      await showNoticeDialog('操作成功', '设备添加成功');
    }
  } catch (error) {
    await showNoticeDialog('操作失败', `设备添加失败: ${error.message}`);
  }
}

async function handleEditDevice(deviceId, currentName) {
  try {
    const input = await showDialogueDialog('编辑设备', '请输入新名称:', currentName);
    if (!input) return;

    // 名称未修改直接返回
    if (input === currentName) return;

    // 客户端验证
    const validationError = validateDeviceName(input);
    if (validationError) {
      await showNoticeDialog('验证失败', validationError);
      return;
    }

    // 服务端查重
    const isDuplicate = await window.myAPI.checkDeviceName(appState.userId, input);
    if (isDuplicate) {
      await showNoticeDialog('操作失败', '设备名称已存在');
      return;
    }

    // 更新数据
    const success = await window.myAPI.updateDevice(deviceId, input);
    if (success) {
      await loadDevices();
      await showNoticeDialog('操作成功', '设备更新成功');
    }
  } catch (error) {
    await showNoticeDialog('操作失败', `设备更新失败: ${error.message}`);
  }
}

async function handleRemoveDevice(deviceId) {
  try {
    const confirmed = await showInquireDialog('删除确认', '确定要删除此设备吗？');
    if (!confirmed) return;

    const success = await window.myAPI.removeDevice(deviceId);
    if (success) {
      await loadDevices();
      await showNoticeDialog('操作成功', '设备删除成功');
    }
  } catch (error) {
    await showNoticeDialog('操作失败', `设备删除失败: ${error.message}`);
  }
}

// ========================
// 工具函数
// ========================
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

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;')
           .replace(/'/g, '&#39;');
}

// ========================
// 启动应用程序
// ========================
document.addEventListener('DOMContentLoaded', initializeApp);