// 创建基础模态容器
function createModalBase() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  return modal;
}

// 显示通知对话框
function showNoticeDialog(message, callback) {
  const modal = createModalBase();
  modal.innerHTML = `
    <div class="modal-content">
      <p>${message}</p>
      <button id="close-modal" class="modal-confirm">确定</button>
    </div>
  `;
  document.body.appendChild(modal);
  const closeButton = modal.querySelector('#close-modal');
  const handleClose = () => {
    modal.remove();
    document.body.focus(); // 焦点回到body
    if (typeof callback === 'function') callback();
  };
  closeButton.addEventListener('click', handleClose);
  closeButton.focus();
  // ESC键关闭支持
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') handleClose();
  });
}

// 显示输入对话框
function showInputDialog(promptMessage, defaultValue, callback) {
  const modal = createModalBase();
  modal.innerHTML = `
    <div class="modal-content">
      <p>${promptMessage}</p>
      <input type="text" id="prompt-input" value="${defaultValue}" placeholder="请输入...">
      <div class="modal-actions">
        <button id="confirm-prompt" class="modal-confirm">确定</button>
        <button id="cancel-prompt" class="modal-cancel">取消</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  const input = modal.querySelector('#prompt-input');
  const confirmBtn = modal.querySelector('#confirm-prompt');
  const cancelBtn = modal.querySelector('#cancel-prompt');
  const cleanup = () => {
    modal.remove();
    document.body.focus(); // 焦点回到body
  };
  const handleConfirm = () => {
    const value = input.value.trim();
    cleanup();
    if (typeof callback === 'function') callback(value);
  };
  const handleCancel = () => {
    cleanup();
    if (typeof callback === 'function') callback(null);
  };
  confirmBtn.addEventListener('click', handleConfirm);
  cancelBtn.addEventListener('click', handleCancel);
  input.focus();
  // 回车键支持
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleConfirm();
  });
  // ESC键支持
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') handleCancel();
  });
}
// 显示确认对话框
function showConfirmDialog(confirmMessage, callback) {
  const modal = createModalBase();
  modal.innerHTML = `
    <div class="modal-content">
      <p>${confirmMessage}</p>
      <div class="modal-actions">
        <button id="confirm-yes" class="modal-confirm">确定</button>
        <button id="confirm-no" class="modal-cancel">取消</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  const yesBtn = modal.querySelector('#confirm-yes');
  const noBtn = modal.querySelector('#confirm-no');
  const handleResponse = (result) => {
    modal.remove();
    document.body.focus(); // 焦点回到body
    if (typeof callback === 'function') callback(result);
  };
  yesBtn.addEventListener('click', () => handleResponse(true));
  noBtn.addEventListener('click', () => handleResponse(false));
  yesBtn.focus();
  // ESC键支持
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') handleResponse(false);
  });
}