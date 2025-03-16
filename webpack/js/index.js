import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/jsm/controls/OrbitControls.js';
import { CSS2DRenderer,CSS2DObject } from './three/jsm/renderers/CSS2DRenderer.js';
import { GLTFLoader } from './three/jsm/loaders/GLTFLoader.js';

const DOM = {
  totalCloseBtn: document.getElementById('total-close-btn'),
  usernameDisplay: document.getElementById('showusername'),
  graphicContainer: document.getElementById('graphic-container'),
  btn1: document.getElementById('btn1'),
  btn2: document.getElementById('btn2'),
  btn3: document.getElementById('btn3'),
  btn4: document.getElementById('btn4'),
  btn5: document.getElementById('btn5'),
  btn6: document.getElementById('btn6'),
  btn7: document.getElementById('btn7'),
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
let humidifier;
let waterParticles = null; // 全局粒子系统实例
let isHumidifying = false; // 喷雾状态控制
let robotMixer1, robotMixer2, robotMixer3, robotMixer4, robotMixer5, robotMixer6;
// 传送带的位置
let positions = [
  { x: 30, y: 6.1, z: 13 },  // 1号传送带
  { x: 0, y: 6.1, z: -9 },  // 2号传送带
  { x: -50, y: 6.1, z: 15 } // 3号传送带
];
// 粒子系统参数
const PARTICLE_COUNT = 1500;
const SPRAY_WIDTH = 2;
const SPRAY_DEPTH = 2;
const FALL_SPEED = 1.2;
const TURBULENCE = 0.5;
const LIFE_TIME = 5;
const container = DOM.graphicContainer;
// 加载GLB模型
const loader = new GLTFLoader();
// 场景初始化
const scene = new THREE.Scene();
// 在 init 函数中初始化时钟
const clock = new THREE.Clock();
// 初始化3D场景
async function init() {
  try {
    let user = await window.myAPI.getUserInfo();
    userInfo.username = user.username;
    userInfo.uid = user.uid;
    userInfo.role = user.role;
    console.log("User Info:", user);
  } catch (error) {
    console.error("Failed to get user info:", error);
  }

  DOM.usernameDisplay.textContent = userInfo.username;

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
  // renderer.setClearColor(0xeeeeee, 1);
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
    conveyorBelt.rotation.set(0, Math.PI, Math.PI / 2);
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
    conveyorBelt.rotation.set(0, -Math.PI / 2, Math.PI / 2);
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

  loader.load('../models/3D_moudle/shower_head.glb', function (gltf) {
    humidifier = gltf.scene;
    // 喷头位置参数调整（示例坐标）
    const SHOWER_POSITION = new THREE.Vector3(0, 20, -10);
    humidifier.position.copy(SHOWER_POSITION);
    humidifier.scale.set(10, 10, 10);
    scene.add(humidifier);

  });

  const loadRoboticArm = new Promise((resolve, reject) => {
    loader.load('../models/3D_moudle/robotic_arm.glb', function (gltf) {
      const robotic = gltf.scene.clone();
      robotic.scale.set(4, 4, 4);
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
        { x: rpos1.x, y: rpos1.y + 8, z: rpos1.z + 13 },
        { x: rpos1.x, y: rpos1.y + 8, z: rpos1.z - 13 },
        { x: rpos2.x + 13, y: rpos2.y + 8, z: rpos2.z },
        { x: rpos2.x - 13, y: rpos2.y + 8, z: rpos2.z },
        { x: rpos3.x, y: rpos3.y + 8, z: rpos3.z - 13 },
        { x: rpos3.x, y: rpos3.y + 8, z: rpos3.z + 13 }
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
          action.paused = true;
          // 设置动画播放速度为原来的2倍
          action.timeScale = 2;
        }
      });

      [robotMixer1, robotMixer2, robotMixer3, robotMixer4, robotMixer5, robotMixer6] = robotMixers;
      resolve();
    }, undefined, function (error) {
      console.error('机械臂模型加载失败:', error);
      reject(error);
    });
  });

  await loadRoboticArm;


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
    // 新增粒子更新逻辑
    if (isHumidifying && waterParticles) {
      updateWaterParticles(deltaTime);
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
// 封装粒子位置计算逻辑
function getParticlePosition() {
  humidifier.updateMatrixWorld();
  const sprayPos = new THREE.Vector3().setFromMatrixPosition(humidifier.matrixWorld);
  const localPos = new THREE.Vector3(
    (Math.random() - 0.5) * SPRAY_WIDTH,
    0, // 喷头高度
    (Math.random() - 0.5) * SPRAY_DEPTH
  );
  localPos.applyMatrix4(humidifier.matrixWorld);
  return localPos;
}
function getAnimationDuration(mixer) {
  if (mixer && mixer._actions.length > 0) {
    const action = mixer._actions[0];
    return action.getClip().duration / action.timeScale;
  }
  return 0;
}

function wheelAction1() {
  loader.load('../models/3D_moudle/wheel_1.glb', function (gltf) {
    const animationDuration = getAnimationDuration(robotMixer1);
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        let wheel = gltf.scene.clone();
        wheel.scale.set(0.2, 0.2, 0.2);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(positions[0].x, positions[0].y, positions[0].z + 13);
        wheels1.push(wheel);
        scene.add(wheel);
      }, i * animationDuration * 1000);
    }
  }, undefined, function (error) {
    console.error('轮子1模型加载失败:', error);
  });
}

function wheelAction2() {
  water();
  loader.load('../models/3D_moudle/wheel_2.glb', function (gltf) {
    const animationDuration = getAnimationDuration(robotMixer3);
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        let wheel = gltf.scene.clone();
        wheel.scale.set(0.5, 0.5, 0.5);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(positions[1].x + 13, positions[1].y, positions[1].z);
        wheels2.push(wheel);
        scene.add(wheel);
      }, i * animationDuration * 1000);
    }
  }, undefined, function (error) {
    console.error('轮子2模型加载失败:', error);
  });
}

function wheelAction3() {
  loader.load('../models/3D_moudle/wheel_3.glb', function (gltf) {
    const animationDuration = getAnimationDuration(robotMixer5);
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        let wheel = gltf.scene.clone();
        wheel.scale.set(1, 1, 1);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(positions[2].x, positions[2].y, positions[2].z - 13);
        wheels3.push(wheel);
        scene.add(wheel);
      }, i * animationDuration * 1000);
    }
  }, undefined, function (error) {
    console.error('轮子3模型加载失败:', error);
  });
}
function totalShow() {
  playAnimation(robotMixer1, '机械臂');
  wheelAction1();
  playAnimation(robotMixer2, '机械臂');
  playAnimation(mixer1, '机器1');
  playAnimation(robotMixer3, '机械臂');
  wheelAction2();
  playAnimation(robotMixer4, '机械臂');
  playAnimation(mixer2, '机器2');
  playAnimation(robotMixer5, '机械臂');
  wheelAction3();
  playAnimation(robotMixer6, '机械臂');
}

function updateWaterParticles(delta) {
  const positions = waterParticles.geometry.attributes.position.array;
  const velocities = waterParticles.geometry.attributes.velocity.array;
  const startTimes = waterParticles.geometry.attributes.startTime.array;
  const time = clock.getElapsedTime();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const idx = i * 3;
    const age = time - startTimes[i];

    // 粒子再生逻辑
    if (age > LIFE_TIME || positions[idx + 1] < -40) { // 低于地面重生
      const localPos = getParticlePosition();
      positions[idx] = localPos.x;
      positions[idx + 1] = localPos.y;
      positions[idx + 2] = localPos.z;

      // 随机速度（带重力）
      velocities[idx] = (Math.random() - 0.5) * 0.3; // X方向随机扰动
      velocities[idx + 1] = -Math.random() * 2 - 1; // 向下速度（-1 ~ -3）
      velocities[idx + 2] = (Math.random() - 0.5) * 0.3; // Z方向随机扰动

      startTimes[i] = time;
      continue;
    }

    // 物理模拟
    positions[idx] += velocities[idx] * delta;
    positions[idx + 1] += velocities[idx + 1] * delta; // 重力影响
    positions[idx + 2] += velocities[idx + 2] * delta;

    // 空气阻力
    velocities[idx] *= 0.95;
    velocities[idx + 2] *= 0.95;
    velocities[idx + 1] += 0.1 * delta; // 增加重力加速度
  }

  waterParticles.geometry.attributes.position.needsUpdate = true;
}

function water() {
  if (!isHumidifying) {
    // 初始化粒子系统
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const startTimes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const localPos = getParticlePosition();
      positions[i * 3] = localPos.x;
      positions[i * 3 + 1] = localPos.y;
      positions[i * 3 + 2] = localPos.z;

      velocities[i * 3] = (Math.random() - 0.5) * 0.3;
      velocities[i * 3 + 1] = -Math.random() * 2 - 1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

      startTimes[i] = clock.getElapsedTime();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('startTime', new THREE.BufferAttribute(startTimes, 1));

    const material = new THREE.PointsMaterial({
      color: 0x87CEEB,
      size: 0.3,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    waterParticles = new THREE.Points(geometry, material);
    scene.add(waterParticles);
    isHumidifying = true;
  } else {
    // 移除粒子系统
    if (waterParticles) {
      scene.remove(waterParticles);
      waterParticles.geometry.dispose();
      waterParticles.material.dispose();
      waterParticles = null;
    }
    isHumidifying = false;
  }
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
      }, duration * 1000 / action.timeScale);
    } else {
      console.log(`${machineName} 没有可播放的动画片段`);
    }
  } else {
    console.log(`${machineName} 或动画混合器未加载！`);
  }
}

// 退出按钮事件
DOM.totalCloseBtn.addEventListener('click', () => {
  window.myAPI.closeMain();
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
  wheelAction1();
});
DOM.btn5.addEventListener('click', () => {
  water();
});
DOM.btn6.addEventListener('click', () => {
  totalShow();
});
DOM.btn7.addEventListener('click', () => {
  window.myAPI.openPanel();
});

// 启动应用
document.addEventListener('DOMContentLoaded', init);