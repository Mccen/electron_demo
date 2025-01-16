const loginForm = document.getElementById('login-form');
const closeBtn = document.getElementById('close-btn');
document.addEventListener('DOMContentLoaded', function () {
    loginFunc();
});
// 监听 page-loaded 事件
window.addEventListener('message', (event) => {
    if (event.data === 'page-loaded') {
        loginFunc();
    }
});

closeBtn.addEventListener('click', () => {
    window.myAPI.closeInit();
});
// 显示自定义模态对话框
function showModalDialog(message, callback) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
          <p>${message}</p>
          <button id="close-modal">确定</button>
        </div>
      `;
    document.body.appendChild(modal);

    const closeModalButton = document.getElementById('close-modal');
    closeModalButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        if (typeof callback === 'function') {
            callback();
        }
    });

    // 确保模态对话框关闭后恢复焦点
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        setTimeout(() => {
            usernameInput.focus();
        }, 0);
    }
}

// 自定义提示对话框
function showPromptDialog(promptMessage, defaultValue, callback) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
          <p>${promptMessage}</p>
          <input type="text" id="prompt-input" value="${defaultValue}" placeholder="请输入...">
          <div class="buttons-container">
            <button id="confirm-prompt">确定</button>
            <button id="cancel-prompt">取消</button>
          </div>
        </div>
      `;
    document.body.appendChild(modal);

    const promptInput = document.getElementById('prompt-input');
    const confirmButton = document.getElementById('confirm-prompt');
    const cancelButton = document.getElementById('cancel-prompt');

    confirmButton.addEventListener('click', () => {
        const inputValue = promptInput.value.trim();
        document.body.removeChild(modal);
        if (typeof callback === 'function') {
            callback(inputValue);
        }
    });

    cancelButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        if (typeof callback === 'function') {
            callback(null);
        }
    });

    // 聚焦到输入框
    promptInput.focus();
}

// 自定义确认对话框
function showConfirmDialog(confirmMessage, callback) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
          <p>${confirmMessage}</p>
          <div class="buttons-container">
            <button id="confirm-yes">确定</button>
            <button id="confirm-no">取消</button>
          </div>
        </div>
      `;
    document.body.appendChild(modal);

    const yesButton = document.getElementById('confirm-yes');
    const noButton = document.getElementById('confirm-no');

    yesButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        if (typeof callback === 'function') {
            callback(true);
        }
    });

    noButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        if (typeof callback === 'function') {
            callback(false);
        }
    });
}

function loginFunc() {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
            const isAuthenticated = await window.myAPI.authenticateUser(username, password);
            if (isAuthenticated) {
                window.myAPI.sendLoginSuccessful(username); // 传递用户名参数
            } else {
                showModalDialog('登录失败，请检查账号或密码');
            }
        } catch (error) {
            console.error('Error during login:', error);
            showModalDialog('登录过程中发生错误，请稍后再试');
        }
    });
}
