const loginForm = document.getElementById('login-form');
const closeBtn = document.getElementById('close-btn');
closeBtn.addEventListener('click', () => {
    window.myAPI.closeInit();
});
document.addEventListener('DOMContentLoaded', function () {
    loginFunc();
});
// 监听 page-loaded 事件
window.addEventListener('message', (event) => {
    if (event.data === 'page-loaded') {
        loginFunc();
    }
});

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
                showNoticeDialog('登录失败，请检查账号或密码');
            }
        } catch (error) {
            console.error('Error during login:', error);
            showNoticeDialog('登录过程中发生错误，请稍后再试');
        }
    });
}