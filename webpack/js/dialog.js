const modal = document.createElement('div');

// notice
async function showNoticeDialog(title, msg) {
    const page = `
        <div class="notice">
            <div class="notice-content">
                <div class="notice-title">
                    <span id="notice-title-in" class="notice-title-in">标题</span>
                </div>
                <div  class="notice-text">
                    <p id="notice-text-in" class="notice-text-in">内容</p>
                </div>
                <div class="notice-btn">
                    <span>
                        <button id="close-btn" class="close-btn">关闭</button>
                    </span>
                </div>
            </div>
        </div>
        <style>
        /* 半透明背景层 */
        .notice {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        /* 提示框内容区域 */
        .notice .notice-content {
            display: grid;
            grid-template-rows: auto auto auto;
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            width: auto;
            max-width: 90vw;
            height: auto;
            max-height: 90vh;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        /* 提示标题样式 */
        .notice-title-in {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        /* 提示文本样式 */
        .notice-text-in {
            font-size: 14px;
            margin-bottom: 20px;
        }
        /* 按钮容器样式 */
        .notice-btn {
            text-align: right;
        }
        /* 关闭按钮样式 */
        .close-btn {
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        .close-btn:hover {
            background-color: #0056b3;
        }
    </style>
    `;
    modal.innerHTML = page;
    // 将modal添加到body内
    document.body.appendChild(modal);
    // 获取元素
    const notice = modal.querySelector('.notice');
    const closeBtn = modal.querySelector('#close-btn');
    const noticeTitle = modal.querySelector('#notice-title-in');
    const noticeText = modal.querySelector('#notice-text-in');
    // 设置标题和消息文本
    noticeTitle.textContent = title;
    noticeText.textContent = msg;
    notice.style.display = 'flex';
    // 关闭提示框
    closeBtn.addEventListener('click', () => {
        notice.style.display = 'none';
        // 移除modal以清理DOM
        document.body.removeChild(modal);
    });
}


// inquire
async function showInquireDialog(title, msg) {
    return new Promise(async (resolve) => {
        const page = `
        <div class="inquire">
        <div class="inquire-content">
            <div class="inquire-title">
                <span id="inquire-title-in" class="inquire-title-in">标题</span>
            </div>
            <div  class="inquire-text">
                <p id="inquire-text-in" class="inquire-text-in">内容</p>
            </div>
            <div class="inquire-btn"><span>
                    <button id="accept-btn" class="accept-btn">确认</button>
                    <button id="cancel-btn" class="cancel-btn">取消</button>
                </span>
            </div>
        </div>
        </div>
        <style>
        /* 半透明背景层 */
        .inquire {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        /* 提示框内容区域 */
        .inquire .inquire-content {
            display: grid;
            grid-template-rows: auto auto auto;
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            width: auto;
            max-width: 90vw;
            height: auto;
            max-height: 90vh;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        /* 提示标题样式 */
        .inquire-title-in {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        /* 提示文本样式 */
        .inquire-text-in {
            font-size: 14px;
            margin-bottom: 20px;
        }
        /* 按钮容器样式 */
        .inquire-btn {
            text-align: right;
        }
        /* 按钮样式 */
        .accept-btn {
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        .cancel-btn {
            background-color: #ff000d;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        .accept-btn:hover {
            background-color: #0056b3;
        }
        .cancel-btn:hover  {
            background-color: #6d0303;
        }
        </style>`;
        modal.innerHTML = page;
        document.body.appendChild(modal);
        // 获取元素
        const inquire = modal.querySelector('.inquire');
        const acceptBtn = modal.querySelector('#accept-btn');
        const cancelBtn = modal.querySelector('#cancel-btn');
        const inquireTitle = modal.querySelector('#inquire-title-in');
        const inquireText = modal.querySelector('#inquire-text-in');
        // 设置标题和消息文本
        inquireTitle.textContent = title;
        inquireText.textContent = msg;
        inquire.style.display = 'flex';
        // 关闭提示框
        acceptBtn.addEventListener('click', () => {
            inquire.style.display = 'none';
            // 移除modal以清理DOM
            document.body.removeChild(modal);
            resolve(true);
        });
        cancelBtn.addEventListener('click', () => {
            inquire.style.display = 'none';
            // 移除modal以清理DOM
            document.body.removeChild(modal);
            resolve(false);
        });

    });
}

// dialogue
async function showDialogueDialog(title, msg) {
    return new Promise(async (resolve) => {
        const page = `
        <div class="dialogue">
    <div class="dialogue-content">
        <div class="dialogue-title">
            <span id="dialogue-title-in" class="dialogue-title-in">标题</span>
        </div>
        <div class="dialogue-text">
            <p id="dialogue-text-in" class="dialogue-text-in">内容</p>
        </div>
        <div class="dialogue-input">
            <input type="text" id="dialogue-input-in" class="dialogue-input-in">
        </div>
        <div class="dialogue-btn">
            <span>
                    <button id="accept-btn" class="accept-btn">确认</button>
                    <button id="cancel-btn" class="cancel-btn">取消</button>
            </span>
        </div>
    </div>
</div>
<style>
    /* 半透明背景层 */
    .dialogue {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    /* 提示框内容区域 */
    .dialogue .dialogue-content {
        display: grid;
        grid-template-rows: auto auto auto;
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        width: auto;
        max-width: 90vw;
        height: auto;
        max-height: 90vh;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    /* 提示标题样式 */
    .dialogue-title-in {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    /* 提示文本样式 */
    .dialogue-text-in {
        font-size: 14px;
        margin-bottom: 20px;
    }

    /* 输入区域样式 */
    .dialogue-input {
        margin-bottom: 20px;
    }

    .dialogue-input-in {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 14px;
    }

    .dialogue-input-in:focus {
        border-color: #007BFF;
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    /* 按钮容器样式 */
    .dialogue-btn {
        text-align: right;
    }

        /* 按钮样式 */
        .accept-btn {
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        .cancel-btn {
            background-color: #ff000d;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        .accept-btn:hover {
            background-color: #0056b3;
        }
        .cancel-btn:hover  {
            background-color: #6d0303;
        }
</style>
        `;
        modal.innerHTML = page;
        document.body.appendChild(modal);
        // 获取元素
        const dialogue = modal.querySelector('.dialogue');
        const acceptBtn = modal.querySelector('#accept-btn');
        const cancelBtn = modal.querySelector('#cancel-btn');
        const dialogueTitle = modal.querySelector('#dialogue-title-in');
        const dialogueText = modal.querySelector('#dialogue-text-in');
        const dialogueInput = modal.querySelector('#dialogue-input-in');
        // 设置标题和消息文本
        dialogueTitle.textContent = title;
        dialogueText.textContent = msg;
        dialogue.style.display = 'flex';
        // 关闭提示框
        acceptBtn.addEventListener('click', () => {
            if (dialogueInput.value == '') {
                dialogue.style.display = 'none';
                // 移除modal以清理DOM
                document.body.removeChild(modal);
                resolve(showDialogueDialog('提示', '内容不可为空！'));
                return;
            } else {
                dialogue.style.display = 'none';
                // 移除modal以清理DOM
                document.body.removeChild(modal);
                resolve(dialogueInput.value);
                return;
            }
        });
        cancelBtn.addEventListener('click', () => {
            dialogue.style.display = 'none';
            // 移除modal以清理DOM
            document.body.removeChild(modal);
            return;
        });
    });
}