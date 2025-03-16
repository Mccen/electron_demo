// 获取 DOM 元素
const DOM = {
    registerForm: document.getElementById('register-form'),
    totalCloseBtn: document.getElementById('total-close-btn'),
    usernameInput: document.getElementById('username'),
    passwordInput: document.getElementById('password'),
    usernameStatus: document.getElementById('username-status')
};

// 关闭初始化窗口的事件监听
if (DOM.totalCloseBtn) {
    DOM.totalCloseBtn.addEventListener('click', () => {
        window.myAPI.closeInit();
    });
}

// 监听 page-loaded 事件
window.addEventListener('message', (event) => {
    if (event.data === 'page-loaded') {
        setupRegistration();
    }
});

// 设置用户名状态
function setUsernameStatus(message, isError) {
    if (DOM.usernameStatus && DOM.usernameInput) {
        DOM.usernameStatus.textContent = message;
        if (isError) {
            DOM.usernameInput.classList.add('error');
        } else {
            DOM.usernameInput.classList.remove('error');
        }
    } else {
        console.warn('Elements not found: usernameInput or usernameStatus');
    }
}

// 检查用户名是否可用
async function checkUsernameAvailability(username) {
    try {
        console.log(`Checking username availability for: ${username}`);
        const isAvailable = await window.myAPI.checkUsername(username);
        if (!isAvailable) {
            setUsernameStatus('用户名已存在', true);
        } else {
            setUsernameStatus('', false);
        }
        return isAvailable;
    } catch (err) {
        console.error('Error checking username availability:', err);
        showNoticeDialog('检查用户名时出错', '请稍后再试');
        return false;
    }
}

// 注册功能设置
function setupRegistration() {
    // 初始化用户名状态
    setUsernameStatus('', false);

    // 用户名输入框失去焦点时检查用户名
    if (DOM.usernameInput) {
        DOM.usernameInput.addEventListener('blur', async () => {
            const username = DOM.usernameInput.value.trim();
            if (username) {
                await checkUsernameAvailability(username);
            }
        });
    }

    // 表单提交事件监听
    if (DOM.registerForm) {
        DOM.registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = DOM.usernameInput.value.trim();
            const password = DOM.passwordInput.value.trim();

            // 检查输入是否为空
            if (!username ||!password) {
                showNoticeDialog('注册失败', '用户名和密码不能为空');
                return;
            }

            // 检查用户名是否可用
            const isUsernameAvailable = await checkUsernameAvailability(username);
            if (!isUsernameAvailable) {
                showNoticeDialog('注册失败', '请使用其他用户名');
                return;
            }

            try {
                const isRegistered = await window.myAPI.registerUser(username, password);
                if (isRegistered) {
                    showNoticeDialog('注册成功!', '');
                    window.myAPI.registrationSuccessful();
                } else {
                    showNoticeDialog('注册失败', '请稍后再试');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                showNoticeDialog('注册过程中发生错误', '请稍后再试');
            }
        });
    }
}

// 页面加载完成后初始化注册功能
document.addEventListener('DOMContentLoaded', setupRegistration);
    