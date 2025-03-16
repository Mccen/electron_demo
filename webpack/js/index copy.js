const DOM = {
    totalCloseBtn: document.getElementById('total-close-btn'),
    usernameDisplay: document.getElementById('showusername'),
    graphicContainer: document.getElementById('graphic-container'),
    btn1: document.getElementById('btn1'),
    btn2: document.getElementById('btn2'),
    btn3: document.getElementById('btn3'),
    btn4: document.getElementById('btn4'),
  };
  
  let userInfo = {
    username: 'unknown',
    uid: 0,
    role: 'null'
  };
  let mixer1, mixer2;
  let machine1, machine2;
  let conveyorBelts = []; // 存储传送带
  let machines = []; // 存储机器
  let wheels1 = []; // 存储轮子
  let wheels2 = [];
  let wheels3 = [];
  let robotMixer1, robotMixer2, robotMixer3, robotMixer4, robotMixer5, robotMixer6;
  // 传送带的位置
  let positions = [
    { x: 30, y: 6.1, z: 13 },  // 1号传送带
    { x: 0, y: 6.1, z: -9 },  // 2号传送带
    { x: -50, y: 6.1, z: 15 } // 3号传送带
  ];
  
  const OrbitControls = THREE.OrbitControls;
  const GLTFLoader = THREE.GLTFLoader;
  const container = DOM.graphicContainer;
  // 加载GLB模型
  const loader = new THREE.GLTFLoader();
  // 场景初始化
  const scene = new THREE.Scene();
  
  // 初始化3D场景
  async function init() {
    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
  
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
  
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0xeeeeee, 1);
    container.appendChild(renderer.domElement);
  
    // 相机控制器配置
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.screenSpacePanning = true;
  
    // 初始相机位置
    camera.position.set(80, 50, 80);
    controls.update();
  
    // 场景光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 创建平行光
    directionalLight.position.set(0, 100, 100); // 设置光源位置
    directionalLight.target.position.set(0, 0, 0); // 设置光照目标
    scene.add(directionalLight);
    scene.add(directionalLight.target);
  
    // 创建传送带区域（地面），增加地面的宽度和深度，确保与扩展后的墙体协调
    const workshopGeometry = new THREE.BoxGeometry(150, 1, 150);  // 增加长度和宽度
    const workshopMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const workshop = new THREE.Mesh(workshopGeometry, workshopMaterial);
    scene.add(workshop);
  
    // 一号传送带
    loader.load('../models/3D_moudle/conveyor_belt.glb', function (gltf) {
        let conveyorBelt = gltf.scene;
        conveyorBelt.position.set(positions[0].x, positions[0].y, positions[0].z);
        conveyorBelt.scale.set(0.01, 0.01, 0.01);
        conveyorBelt.rotation.set(0, 0, Math.PI / 2);
        scene.add(conveyorBelt);
        conveyorBelts.push(conveyorBelt);
    }, undefined, function (error) {
        console.error('一号传送带模型加载失败:', error);
    });
  
    // 二号传送带
    loader.load('../models/3D_moudle/conveyor_belt.glb', function (gltf) {
        let conveyorBelt = gltf.scene;
        conveyorBelt.position.set(positions[1].x, positions[1].y, positions[1].z);
        conveyorBelt.scale.set(0.01, 0.01, 0.01);
        conveyorBelt.rotation.set(0, Math.PI / 2, Math.PI / 2);
        scene.add(conveyorBelt);
        conveyorBelts.push(conveyorBelt);
    }, undefined, function (error) {
        console.error('二号传送带模型加载失败:', error);
    });
  
    // 三号传送带
    loader.load('../models/3D_moudle/conveyor_belt.glb', function (gltf) {
        let conveyorBelt = gltf.scene;
        conveyorBelt.position.set(positions[2].x, positions[2].y, positions[2].z);
        conveyorBelt.scale.set(0.01, 0.01, 0.01);
        conveyorBelt.rotation.set(0, 0, Math.PI / 2);
        scene.add(conveyorBelt);
        conveyorBelts.push(conveyorBelt);
    }, undefined, function (error) {
        console.error('三号传送带模型加载失败:', error);
    });
  
    // 加载机器一
    loader.load('../models/3D_moudle/machine1.glb', function (gltf) {
        machine1 = gltf.scene;
        machine1.position.set(40, 0.5, -3);
        machine1.scale.set(1.0, 1.0, 1.0);
        machine1.rotation.set(0, Math.PI, 0);
        scene.add(machine1);
        if (gltf.animations && gltf.animations.length > 0) {
            mixer1 = new THREE.AnimationMixer(machine1);
            gltf.animations.forEach((clip) => {
                const action = mixer1.clipAction(clip);
                action.play();
                action.paused = true;
            });
        } else {
            console.log("机器1模型没有动画！");
        }
        machines.push(machine1);
    }, undefined, function (error) {
        console.error('机器1模型加载失败:', error);
    });
  
    // 加载机器二
    loader.load('../models/3D_moudle/machine2.glb', function (gltf) {
        machine2 = gltf.scene;
        machine2.position.set(-34, 0.1, -8);
        machine2.scale.set(0.005, 0.005, 0.005);
        machine2.rotation.set(0, 0, 0);
        scene.add(machine2);
        if (gltf.animations && gltf.animations.length > 0) {
            mixer2 = new THREE.AnimationMixer(machine2);
            gltf.animations.forEach((clip) => {
                const action = mixer2.clipAction(clip);
                action.play();
                action.paused = true;
            });
        } else {
            console.log("机器2模型没有动画！");
        }
        machines.push(machine2);
    }, undefined, function (error) {
        console.error('机器2模型加载失败:', error);
    });
  
    loader.load('../models/3D_moudle/robotic_arm.glb', function (gltf) {
      const robotic = gltf.scene.clone();
      robotic.scale.set(0.005, 0.005, 0.005);
      robotic.rotation.x = Math.PI;
  
      const robots = [
          robotic.clone(),
          robotic.clone(),
          robotic.clone(),
          robotic.clone(),
          robotic.clone(),
          robotic.clone()
      ];
  
      const rpos1 = positions[0];
      const rpos2 = positions[1];
      const rpos3 = positions[2];
  
      const robotPositions = [
          { x: rpos1.x, y: rpos1.y+10, z: rpos1.z + 13 },
          { x: rpos1.x, y: rpos1.y+10, z: rpos1.z - 13 },
          { x: rpos2.x + 13, y: rpos2.y+10, z: rpos2.z },
          { x: rpos2.x - 13, y: rpos2.y+10, z: rpos2.z },
          { x: rpos3.x, y: rpos3.y+10, z: rpos3.z - 13 },
          { x: rpos3.x, y: rpos3.y+10, z: rpos3.z + 13 }
      ];
  
      let robotMixers = [];
  
      robots.forEach((robot, index) => {
          robot.position.set(robotPositions[index].x, robotPositions[index].y, robotPositions[index].z);
          scene.add(robot);
  
          if (gltf.animations && gltf.animations.length > 0) {
              const mixer = new THREE.AnimationMixer(robot);
              robotMixers.push(mixer);
              const action = mixer.clipAction(gltf.animations[0]);
              action.play();
          }
      });
  
      [robotMixer1, robotMixer2, robotMixer3, robotMixer4, robotMixer5, robotMixer6] = robotMixers;
  });
  
    // 在 init 函数中初始化时钟
    const clock = new THREE.Clock();
    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        const deltaTime = clock.getDelta(); // 获取时间增量
  
        controls.update();
  
        // 更新动画混合器（关键步骤！）
        if (mixer1) mixer1.update(deltaTime);
        if (mixer2) mixer2.update(deltaTime);
        [robotMixer1, robotMixer2, robotMixer3, robotMixer4, robotMixer5, robotMixer6].forEach(mixer => {
            if (mixer) mixer.update(deltaTime);
        });
  
        // 更新轮子动画
        for (let i = 0; i < wheels1.length; i++) {
            if (wheels1[i].position.z >= positions[0].z - 13) {
                wheels1[i].position.z -= 0.1;
            }
        }
        for (let i = 0; i < wheels2.length; i++) {
            if (wheels2[i].position.x >= positions[1].x - 13) {
                wheels2[i].position.x -= 0.1;
            }
        }
        for (let i = 0; i < wheels3.length; i++) {
            if (wheels3[i].position.z <= positions[2].z + 13) {
                wheels3[i].position.z += 0.1;
            }
        }
        renderer.render(scene, camera);
    }
  
    // 窗口调整处理
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
  
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
  
        renderer.setSize(width, height);
        controls.update(); 
    });
  
    animate();
  }
  
  function wheelAction1() {
    loader.load('../models/3D_moudle/wheel_1.glb', function (gltf) {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                let wheel = gltf.scene.clone();
                wheel.scale.set(0.2, 0.2, 0.2);
                wheel.rotation.x = Math.PI / 2;
                wheel.position.set(positions[0].x, positions[0].y, positions[0].z + 13);
                wheels1.push(wheel);
                scene.add(wheel);
            }, i * 1000);
        }
    }, undefined, function (error) {
        console.error('轮子1模型加载失败:', error);
    });
  }
  
  function wheelAction2() {
    loader.load('../models/3D_moudle/wheel_2.glb', function (gltf) {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                let wheel = gltf.scene.clone();
                wheel.scale.set(0.2, 0.2, 0.2);
                wheel.rotation.x = Math.PI / 2;
                wheel.position.set(positions[1].x + 13, positions[1].y, positions[1].z);
                wheels2.push(wheel);
                scene.add(wheel);
            }, i * 1000);
        }
    }, undefined, function (error) {
        console.error('轮子2模型加载失败:', error);
    });
  }
  
  function wheelAction3() {
    loader.load('../models/3D_moudle/wheel_2.glb', function (gltf) {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                let wheel = gltf.scene.clone();
                wheel.scale.set(0.2, 0.2, 0.2);
                wheel.rotation.x = Math.PI / 2;
                wheel.position.set(positions[2].x, positions[2].y, positions[2].z - 13);
                wheels3.push(wheel);
                scene.add(wheel);
            }, i * 1000);
        }
    }, undefined, function (error) {
        console.error('轮子3模型加载失败:', error);
    });
  }
  
  // 封装动画播放和停止逻辑
  function playAnimation(mixer, machineName) {
    if (mixer) {
        console.log(`播放 ${machineName} 的动画`);
        if (mixer._actions.length > 0) {
            const action = mixer._actions[0];
            action.play();
            action.paused = false;
            console.log(`播放动画片段: ${action.getClip().name}`);
            const duration = action.getClip().duration;
            setTimeout(() => {
                mixer.stopAllAction();
                console.log(`停止 ${machineName} 的动画`);
            }, duration * 1000);
        } else {
            console.log(`${machineName} 没有可播放的动画片段`);
        }
    } else {
        console.log(`${machineName} 或动画混合器未加载！`);
    }
  }
  
  // 退出按钮事件
  DOM.totalCloseBtn.addEventListener('click', () => {
    window.close();
  });
  
  DOM.btn1.addEventListener('click', () => {
    playAnimation(mixer1, '机器1');
  });
  
  DOM.btn2.addEventListener('click', () => {
    playAnimation(mixer2, '机器2');
  });
  
  DOM.btn3.addEventListener('click', () => {
    playAnimation(robotMixer1, '机械臂');
  });
  
  DOM.btn4.addEventListener('click', () => {
    wheelAction3();
  });
  
  // 启动应用
  document.addEventListener('DOMContentLoaded', init);
    















// // ========================
// // 常量与DOM引用
// // ========================
// const DOM = {
//   totalCloseBtn: document.getElementById('total-close-btn'),
//   deviceList: document.getElementById('device-list'),
//   addDeviceBtn: document.getElementById('add-device-button'),
//   usernameDisplay: document.getElementById('showusername'),
//   openPanelBtn: document.getElementById('open-panel-button')
// };

// // ========================
// // 应用程序状态
// // ========================
// let appState = {
//   userName: '',
//   userId: null
// };
// let userInfo = {
//   username: 'unknown',
//   uid: 0,
//   role: 'null'
// };
// // ========================
// // 初始化入口
// // ========================
// async function initializeApp() {
//   try{
//     let user = await window.myAPI.getUserInfo();
//     userInfo.username = user.username;
//     userInfo.uid = user.uid;
//     appState.userId = user.uid;
//     console.log("User Info:", user);
//   }catch (error) {
//     console.error("Failed to get user info:", error);
//   }
//   setupEventListeners();
//   loadUserData().then(loadDevices);
// }

// // ========================
// // 事件监听配置
// // ========================
// function setupEventListeners() {
//   DOM.totalCloseBtn?.addEventListener('click', handleCloseApp);
//   DOM.addDeviceBtn?.addEventListener('click', handleAddDevice);
//   DOM.openPanelBtn?.addEventListener('click', handleOpenPanel);
  
//   DOM.deviceList?.addEventListener('click', function(event) {
//     const target = event.target;
//     const deviceItem = target.closest('.device-item');
//     if (!deviceItem) return;

//     const deviceId = deviceItem.dataset.deviceId;
//     const deviceName = deviceItem.querySelector('b').textContent;

//     if (target.classList.contains('edit-device')) {
//       handleEditDevice(deviceId, deviceName);
//     } else if (target.classList.contains('remove-device')) {
//       handleRemoveDevice(deviceId);
//     }
//   });
// }

// // ========================
// // 基础事件处理器
// // ========================
// function handleCloseApp() {
//   window.myAPI?.closeMain?.();
// }

// function handleOpenPanel() {
//   window.myAPI?.openPanel?.();
// }

// // ========================
// // 核心业务逻辑
// // ========================
// async function loadUserData() {
//   try {

//     DOM.usernameDisplay.textContent = userInfo.username;
//   } catch (error) {
//     await showNoticeDialog('错误', '用户数据加载失败');
//   }
// }

// async function loadDevices() {
//   try {
//     const devices = await window.myAPI.getDeviceListByUserId(appState.userId);
//     renderDeviceList(devices);
//   } catch (error) {
//     await showNoticeDialog('错误', '设备列表加载失败');
//   }
// }

// function renderDeviceList(devices) {
//   if (!Array.isArray(devices)) return;
  
//   DOM.deviceList.innerHTML = devices.map(device => `
//     <li class="device-item">
//       <div class="device-info">
//         <b>${escapeHTML(device.DeviceName)}</b>
//       </div>
//       <div class="device-actions">
//         <button class="edit-device">编辑</button>
//         <button class="remove-device">删除</button>
//       </div>
//     </li>
//   `).join('');
// }

// // ========================
// // 设备操作处理（完整版）
// // ========================
// async function handleAddDevice() {
//   try {
//     const input = await showDialogueDialog('添加设备', '请输入新设备名称:');
//     if (!input) return;

//     // 客户端验证
//     const validationError = validateDeviceName(input);
//     if (validationError) {
//       await showNoticeDialog('验证失败', validationError);
//       return;
//     }

//     // 服务端查重
//     const isDuplicate = await window.myAPI.checkDeviceName(appState.userId, input);
//     if (isDuplicate) {
//       await showNoticeDialog('操作失败', '设备名称已存在');
//       return;
//     }

//     // 提交数据
//     const success = await window.myAPI.addDevice(appState.userId, input);
//     if (success) {
//       await loadDevices();
//       await showNoticeDialog('操作成功', '设备添加成功');
//     }
//   } catch (error) {
//     await showNoticeDialog('操作失败', `设备添加失败: ${error.message}`);
//   }
// }

// async function handleEditDevice(deviceId, currentName) {
//   try {
//     const input = await showDialogueDialog('编辑设备', '请输入新名称:', currentName);
//     if (!input) return;

//     // 名称未修改直接返回
//     if (input === currentName) return;

//     // 客户端验证
//     const validationError = validateDeviceName(input);
//     if (validationError) {
//       await showNoticeDialog('验证失败', validationError);
//       return;
//     }

//     // 服务端查重
//     const isDuplicate = await window.myAPI.checkDeviceName(appState.userId, input);
//     if (isDuplicate) {
//       await showNoticeDialog('操作失败', '设备名称已存在');
//       return;
//     }

//     // 更新数据
//     const success = await window.myAPI.updateDevice(deviceId, input);
//     if (success) {
//       await loadDevices();
//       await showNoticeDialog('操作成功', '设备更新成功');
//     }
//   } catch (error) {
//     await showNoticeDialog('操作失败', `设备更新失败: ${error.message}`);
//   }
// }

// async function handleRemoveDevice(deviceId) {
//   try {
//     const confirmed = await showInquireDialog('删除确认', '确定要删除此设备吗？');
//     if (!confirmed) return;

//     const success = await window.myAPI.removeDevice(deviceId);
//     if (success) {
//       await loadDevices();
//       await showNoticeDialog('操作成功', '设备删除成功');
//     }
//   } catch (error) {
//     await showNoticeDialog('操作失败', `设备删除失败: ${error.message}`);
//   }
// }

// // ========================
// // 工具函数
// // ========================
// function validateDeviceName(name) {
//   const MAX_NAME_LENGTH = 20;
//   const INVALID_CHARS = /[<>%$#*]/;
  
//   if (!name || name.trim().length === 0) {
//     return '设备名称不能为空';
//   }
  
//   if (name.length > MAX_NAME_LENGTH) {
//     return `设备名称不能超过${MAX_NAME_LENGTH}个字符`;
//   }
  
//   if (INVALID_CHARS.test(name)) {
//     return '设备名称包含非法字符';
//   }
  
//   return null;
// }

// function escapeHTML(str) {
//   return str.replace(/&/g, '&amp;')
//            .replace(/</g, '&lt;')
//            .replace(/>/g, '&gt;')
//            .replace(/"/g, '&quot;')
//            .replace(/'/g, '&#39;');
// }

// // ========================
// // 启动应用程序
// // ========================
// document.addEventListener('DOMContentLoaded', initializeApp);