const registerForm = document.getElementById('register-form');
const closeBtn = document.getElementById('close-btn');
document.addEventListener('DOMContentLoaded', function () {
    registerFunc();
});
// 监听 page-loaded 事件
window.addEventListener('message', (event) => {
    if (event.data === 'page-loaded') {
        registerFunc();
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

// 设置用户名状态
function setUsernameStatus(message, isError) {
    const usernameInput = document.getElementById('username');
    const usernameStatus = document.getElementById('username-status');

    if (usernameStatus && usernameInput) {
        usernameStatus.textContent = message;
        if (isError) {
            usernameInput.classList.add('error'); // 添加样式以突出显示错误
        } else {
            usernameInput.classList.remove('error');
        }
    } else {
        console.warn('Elements not found: usernameInput or usernameStatus');
    }
}
// 检查用户名是否存在的函数
async function checkUsernameAvailability(username) {
    try {
        console.log(`Checking username availability for: ${username}`);
        const isAvailable = await window.myAPI.checkUsername(username);
        if (!isAvailable) {
            setUsernameStatus('用户名已存在', true);
        } else {
            setUsernameStatus('', false);
        }
    } catch (err) {
        console.error('Error checking username availability:', err);
    }
}

function registerFunc() {
    // 确保每次加载页面时清除用户名状态
    setUsernameStatus('', false);
    // 当用户名输入框失去焦点时检查用户名
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.addEventListener('blur', () => {
            const username = usernameInput.value;
            if (username) {
                checkUsernameAvailability(username);
            }
        });
        // 在提交表单前再次检查用户名
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // 如果用户名已存在，阻止表单提交
            const usernameStatus = document.getElementById('username-status');
            if (usernameStatus && usernameStatus.textContent) {
                showModalDialog('请使用其他用户名');
                return;
            }

            try {
                const isRegistered = await window.myAPI.registerUser(username, password);
                if (isRegistered) {
                    showModalDialog('注册成功!', () => {
                        window.myAPI.registrationSuccessful(); // 导航到登录页面
                    });
                } else {
                    showModalDialog('注册失败');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                showModalDialog('注册过程中发生错误，请稍后再试');
            }
        });
    } else {
        console.warn('Element not found: usernameInput');
    }
}
