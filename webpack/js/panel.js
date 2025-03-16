function getTemp(dname) {
    return window.myAPI.getMqttTemp(dname);
}
function setWheelNum(wheelNum) {
    let list = document.getElementById('list');
    if (list) { // 确保元素存在
        // 尝试找到已有的 wheelNum 列表项
        let wheelItem = list.querySelector(`li[data-wheel='wheelNum']`);
        
        if (wheelItem) {
            // 如果找到了该列表项，则更新其文本内容
            wheelItem.textContent = `已完成${wheelNum}`;
        } else {
            // 如果没有找到该列表项，则创建一个新的
            let newLi = document.createElement('li');
            newLi.dataset.wheel = 'wheelNum'; // 使用 data 属性来标识这个列表项
            newLi.textContent = `已完成${wheelNum}`;
            list.appendChild(newLi);
        }
    } else {
        console.error("未找到ID为'list'的元素");
    }
}