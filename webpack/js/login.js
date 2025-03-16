DOM = {
    loginForm : document.getElementById('login-form'),
    totalCloseBtn : document.getElementById('total-close-btn'),
}

DOM.totalCloseBtn.addEventListener('click', () => {
    window.myAPI.closeInit();
});

// 监听 page-loaded 事件
window.addEventListener('message', (event) => {
    if (event.data === 'page-loaded') {
        loginFunc();
    }
});

function loginFunc() {
    DOM.loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
            const isAuthenticated = await window.myAPI.authenticateUser(username, password);
            if (isAuthenticated) {
                await window.myAPI.sendLoginSuccessful();
            } else {
                showNoticeDialog('登录失败','请检查账号或密码');
            }
        } catch (error) {
            console.error('Error during login:', error);
            showNoticeDialog('登录失败','登录过程中发生错误，请稍后再试');
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {
    loginFunc();
});