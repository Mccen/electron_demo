// 模拟通知数据
const notifications = [];

// 更新通知列表的函数
function updateNoticeList() {
    const noticeList = document.getElementById('notice-list');
    noticeList.innerHTML = '';
    // 确保只显示最新的 10 条通知
    const latestNotifications = notifications.slice(-10);

    latestNotifications.forEach(notification => {
        const li = document.createElement('li');
        li.textContent = `警报类型: ${notification.alarmType}, 设备号: ${notification.deviceNumber}, 时间: ${notification.time}`;
        noticeList.appendChild(li);
    });
}

// 模拟新通知加入
function addNotification(alarmType, deviceNumber, time) {
    const newNotification = {
        alarmType,
        deviceNumber,
        time
    };

    notifications.push(newNotification);
    updateNoticeList();
}

// 示例：添加新通知
addNotification('高温警报', '001', '2025-03-16 16:23:18');
addNotification('高温警报', '002', '2025-03-16 16:44:33');
addNotification('高温警报', '001', '2025-03-16 17:11:21');
addNotification('高温警报', '001', '2025-03-16 17:23:38');
