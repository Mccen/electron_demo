DOM = {
    registerForm : document.getElementById('register-form'),
    totalCloseBtn : document.getElementById('total-close-btn'),
}


DOM.totalCloseBtn.addEventListener('click', () => {
    window.myAPI.closeInit();
});
document.addEventListener('DOMContentLoaded', function () {
    registerFunc();
});
// 监听 page-loaded 事件
window.addEventListener('message', (event) => {
    if (event.data === 'page-loaded') {
        registerFunc();
    }
});

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
        DOM.registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // 如果用户名已存在，阻止表单提交
            const usernameStatus = document.getElementById('username-status');
            if (usernameStatus && usernameStatus.textContent) {
                showNoticeDialog('注册失败','请使用其他用户名');
                return;
            }

            try {
                const isRegistered = await window.myAPI.registerUser(username, password);
                if (isRegistered) {
                    showNoticeDialog('注册成功!','');
                    window.myAPI.registrationSuccessful(); // 导航到登录页面
                } else {
                    showNoticeDialog('注册失败','请稍后再试');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                showNoticeDialog('注册过程中发生错误，请稍后再试');
            }
        });
    } else {
        console.warn('Element not found: usernameInput');
    }
}
