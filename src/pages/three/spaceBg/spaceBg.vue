<template>
  <div class="loginBg">
    <div class="login" ref="login"></div>
    <div class="floatDom">
      <img class="moon" src="@/assets/images/moon.png" alt="">
      <img class="man" src="@/assets/images/man.png" alt="">
      <div class="form">
      <div class="card">
        Magic Card
      </div>
    </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, watchEffect } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x000000, 0, 10000) // 添加雾的效果

const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1, 30000)
// 计算相机距离物体的位置
const distance = window.innerWidth / 2 / Math.tan(Math.PI / 12)
const zAxisNumber = Math.floor(distance - 1400 / 2)
camera.position.set(0, 0, zAxisNumber) // 设置相机所在位置
camera.lookAt(0, 0, 0) // 看向原点
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

// 添加控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enabled = true // 设置控制是否可用
// 设置缩放范围
controls.minDistance = zAxisNumber // 设置最小缩放距离
controls.maxDistance = zAxisNumber + 500 // 设置最大缩放距离
controls.enableDamping = true // 设置控制阻尼

const init = () => {
  loadSkyBox()
  loadEarth()
  loadLight()

};
let sphere: THREE.Mesh;
const loadEarth = () => {
  const EARTHIMG = new URL('@/assets/images/Google.jpg', import.meta.url).href
  // 添加球体
  const SphereGeometry = new THREE.SphereGeometry(100, 120, 32) // 创建球体几何体
  const Spherematerial = new THREE.MeshPhongMaterial({ transparent: false })
  sphere = new THREE.Mesh(SphereGeometry, Spherematerial) // 创建网格模型
  Spherematerial.map = new THREE.TextureLoader().load(EARTHIMG) // 创建材质
  sphere.position.set(-400, 200, -200) // 设置位置
  scene.add(sphere) // 添加到场景
};
const loadSkyBox = () => {
  let sources = [
    "@/assets/images/starmap_2020_16k_px.jpg",
    "@/assets/images/starmap_2020_16k_mx.jpg",
    "@/assets/images/starmap_2020_16k_py.jpg",
    "@/assets/images/starmap_2020_16k_my.jpg",
    "@/assets/images/starmap_2020_16k_pz.jpg",
    "@/assets/images/starmap_2020_16k_mz.jpg",
  ]
  const loader = new THREE.TextureLoader()
  // 创建盒子，并设置盒子的大小为( 5000, 5000, 5000 )
  const skyGeometry = new THREE.BoxGeometry(window.innerWidth, window.innerHeight, 1400)
  // 设置盒子材质
  const materialArray = []
  for (let i = 0; i < 6; i++)
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: loader.load(sources[i]), // 将图片纹理贴上
        side: THREE.BackSide // 镜像翻转
      })
    )
  // 创建一个完整的天空盒，填入几何模型和材质的参数
  const skyBox = new THREE.Mesh(skyGeometry, materialArray)
  scene.add(skyBox) // 在场景中加入天空盒
};
const loadLight = () => {
  // 添加光源
  const ambientlight = new THREE.AmbientLight(0xffffff, 1) // 创建环境光源
  scene.add(ambientlight) // 添加到场景
  const positLight = new THREE.PointLight('#4489f9', 5, 0) // 创建点光源
  positLight.position.set(0, 200, 100) // 设置位置
  scene.add(positLight) // 添加到场景
  window.addEventListener('resize', onWindowResize);
};

const STAR1IMG = new URL('@/assets/images/snowflake.png', import.meta.url).href
const STAR2IMG = new URL('@/assets/images/fire.png', import.meta.url).href
// 初始位置
let initZposition = -zAxisNumber - 1400
// 声明点的参数
let parameters = []
let materials = [] // 创建材质数组
// 初始化星星效果
const initSceneStar = (initZposition) => {
  const starGeometry = new THREE.BufferGeometry()
  // 星星位置的坐标
  const starPosition = []
  // 创建纹理
  const starTexture = new THREE.TextureLoader()
  const sprite1 = starTexture.load(STAR1IMG)
  const sprite2 = starTexture.load(STAR2IMG)
  // 星星的数据
  const pointsGeometry = []
  parameters = [
    [[0.6, 100, 0.75], sprite1, 50],
    [[0, 0, 1], sprite2, 20],
  ]
  // 创建1500颗星星
  for (let i = 0; i < 1500; i++) {
    const x = THREE.MathUtils.randFloatSpread(window.innerWidth) // 随机x坐标
    if (window.innerHeight > 0 && zAxisNumber > 0) {
      const y = Math.random() * (window.innerHeight / 2);
      const z = Math.random() * (zAxisNumber + 1400 / 2) - 1400 / 2;
      starPosition.push(x, y, z);
    } else {
      console.error("Invalid values for window.innerHeight or zAxisNumber");
    }
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPosition, 3)) // 设置坐标

  // 创建两种不同的材质
  for (let i = 0; i < parameters.length; i++) {
    const color = parameters[i][0] // 颜色
    const sprite = parameters[i][1] // 纹理
    const size = parameters[i][2] // 点的大小
    materials[i] = new THREE.PointsMaterial({ // 创建材质
      size: size, // 点的大小
      map: sprite, // 纹理
      blending: THREE.AdditiveBlending, // 混合模式
      transparent: true, // 背景透明
      depthTest: true, // 深度测试
    })
    materials[i].color.setHSL(color[0], color[1], color[2]) // 设置颜色
    const points = new THREE.Points(starGeometry, materials[i]) // 创建点
    points.rotation.x = Math.random() * 0.2 - 0.15 // 随机旋转x轴
    points.rotation.y = Math.random() * 0.2 - 0.15 // 随机旋转y轴
    points.rotation.z = Math.random() * 0.2 - 0.15 // 随机旋转z轴 
    points.position.setZ(initZposition) // 设置z轴位置
    pointsGeometry.push(points) // 添加到数组
    scene.add(points) // 添加到场景
  }
  return pointsGeometry // 返回数组
}
// 声明点1，点2在z轴上的移动位置
let zprogress1 = -zAxisNumber - 1400 / 2
let zprogress2 = (-zAxisNumber - 1400 / 2) * 2
// 声明点1，点2的数据
let zprogress_first = []
let zprogress_second = []

// 渲染星星的运动效果
const renderStarMove = () => {
  // 星星颜色交替变化
  const time = Date.now() * 0.00005 // 获取当前时间
  for (let i = 0; i < parameters.length; i++) {
    const color = parameters[i][0] // 颜色 
    const h = ((360 * (color[0] + time)) % 360) / 360 // 计算颜色
    materials[i].color.setHSL(color[0], color[1], parseFloat(h.toFixed(2))) // 设置颜色
  }
  // 完成星星的运动
  zprogress1 += 1
  zprogress2 += 1
  // 判断点1，点2是否到达边界
  if (zprogress1 >= zAxisNumber + 1400 / 2) {
    zprogress1 = -zAxisNumber - 1400 / 2
  } else {
    zprogress_first.forEach(item => {
      item.position.setZ(zprogress1) // 设置z轴位置
    })
  }
  if (zprogress2 >= zAxisNumber + 1400 / 2) {
    zprogress2 = -zAxisNumber - 1400 / 2
  } else {
    zprogress_second.forEach(item => {
      item.position.setZ(zprogress2) // 设置z轴位置
    })
  }
}
// 球体自转
const renderSphereRotate = () => {
  sphere.rotateY(0.001)
}
// 创建两片星云
let cloudFirst
let cloudSecond
// 创建星云的渲染函数
let renderCloudFirst
let renderCloudSecond
// 设置渲染函数
const render = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
  renderSphereRotate() // 自转
  renderStarMove() // 星星移动
  renderCloudFirst() // 云1运动
  renderCloudSecond() // 云2运动
}

const onWindowResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
};
const CLOUDIMG = new URL('@/assets/images/cloud1.jpg', import.meta.url).href
// 渲染星云的效果
const renderCloud = (width, height) => {
  const texture = new THREE.TextureLoader().load(CLOUDIMG) // 加载纹理
  const geometry = new THREE.PlaneGeometry(width, height) // 创建平面
  const material = new THREE.MeshBasicMaterial({ // 创建材质
    map: texture, // 纹理
    side: THREE.DoubleSide, // 渲染双面
    transparent: true, // 透明
    depthTest: false, // 深度测试
    blending: THREE.AdditiveBlending, // 混合模式
  })
  const plane = new THREE.Mesh(geometry, material) // 创建平面
  scene.add(plane) // 添加到场景
  return plane
}
// 渲染星云的运动效果
const renderCloudMove = (cloud, route, speed) => {
  let cloudProgress = 0 // 星云位置
  // 创建三维曲线
  const curve = new THREE.CatmullRomCurve3(route)
  // 创建星云的运动轨迹
  return () => {
    if (cloudProgress <= 1) {
      cloudProgress += speed
      const point = curve.getPoint(cloudProgress) // 获取当前位置
      if (point && point.x) {
        cloud.position.set(point.x, point.y, point.z) // 设置位置
      }
    } else {
      cloudProgress = 0
    }
  }
}
let login = ref(null)

onMounted(() => {
  init();
  login.value.appendChild(renderer.domElement) // 添加渲染器到div中
  initSceneStar(initZposition) // 初始化星星
  zprogress_first = initSceneStar(zprogress1) // 初始化点1
  zprogress_second = initSceneStar(zprogress2) // 初始化点2
  cloudFirst = renderCloud(400, 200)
  cloudSecond = renderCloud(200, 100)
  renderCloudFirst = renderCloudMove(cloudFirst, [
    new THREE.Vector3(-window.innerWidth / 10, 0, -1400 / 2),
    new THREE.Vector3(-window.innerWidth / 4, window.innerHeight / 8, 0),
    new THREE.Vector3(-window.innerWidth / 4, 0, zAxisNumber),
  ], 0.0002)
  renderCloudSecond = renderCloudMove(cloudSecond, [
    new THREE.Vector3(window.innerWidth / 8, window.innerHeight / 8, -1400 / 2),
    new THREE.Vector3(window.innerWidth / 8, window.innerHeight / 8, zAxisNumber),
  ], 0.0008)
  render()
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize);
});

watchEffect(() => {

});

</script>

<style lang="scss" scoped>
.loginBg {
  overflow: hidden;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  --card-height: 280px;
  --card-width: 580px;
}

.floatDom {
  overflow: hidden;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.moon {
  width: 100%;
  position: absolute;
  top: 350px;
  left: 0;
  user-select: auto;
  pointer-events: none;
}

.man {
  position: absolute;
  top: 300px;
  right: 280px;
  width: 280px;
  animation: bounce 3s ease-in-out infinite;
}
.form{
  position: absolute;
  top: 350px;
  right: calc(50% - 250px);
  width: 500px;
  height: 280px;
  transform: translateY(0);
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px) translateX(-10px);
  }

  100% {
    transform: translateY(0);
  }
}

@property --rotate {
  syntax: "<angle>";
  initial-value: 132deg;
  inherits: false;
}

.card {
  background: #161824;
  width: var(--card-width);
  height: var(--card-height);
  // padding: 3px;
  position: relative;
  border-radius: 6px;
  justify-content: center;
  align-items: center;
  text-align: center;
  display: flex;
  font-size: 1.5em;
  color: rgb(88 199 250 / 0%);
  cursor: pointer;
  font-family: cursive;
}

.card:hover {
  color: rgb(88 199 250 / 100%);
  transition: color 1s;
}

.card:hover:before,
.card:hover:after {
  animation: none;
  opacity: 0;
}


.card::before {
  content: "";
  width: calc(var(--card-width) + 10px);
  height: calc(var(--card-height) + 10px);;
  border-radius: 8px;
  background-image: linear-gradient(var(--rotate), #5ddcff, #3c67e3 43%, #4e00c2);
  position: absolute;
  z-index: -1;
  top: -5px;
  left: -5px;
  animation: spin 2.5s linear infinite;
}

.card::after {
  position: absolute;
  content: "";
  top: calc(var(--card-height) / 6);
  left: 0;
  right: 0;
  z-index: -1;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  transform: scale(0.8);
  filter: blur(calc(var(--card-height) / 6));
  background-image: linear-gradient(var(--rotate), #5ddcff, #3c67e3 43%, #4e00c2);
  opacity: 1;
  transition: opacity .5s;
  animation: spin 2.5s linear infinite;
}

@keyframes spin {
  0% {
    --rotate: 0deg;
  }

  100% {
    --rotate: 360deg;
  }
}
</style>