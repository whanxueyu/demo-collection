<template>
  <div class="status-bar flex">
    <div>经度: {{ longitude.toFixed(6) }}</div>
    <div>纬度: {{ latitude.toFixed(6) }}</div>
    <!-- <div class="hide1000">横：{{ easting }} 纵：{{ northing }}</div> -->
    <!-- <div>海拔：{{ altitude }} 米</div> -->
    <!-- <div class="hide700">层级：{{ zoomLevel }}</div> -->
    <div>方向：{{ heading.toFixed(2) }}°</div>
    <div>俯仰角：{{ pitch.toFixed(2) }}°</div>
    <div class="hide700">视高：{{ eyeHeight.toFixed(2) }} 米</div>
    <div class="hide700">帧率：{{ frameRateFPS }} FPS {{ frameRateMS }} MS</div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from 'vue';
import * as Cesium from 'cesium';
import GetFPSInfo from '@/modules/status-bar/custom-fps';
const props = defineProps({
  viewer: {
    type: Cesium.Viewer,
    required: true
  }
});
// 定义状态栏数据

const longitude = ref(0);
const latitude = ref(0);
const easting = ref(0);
const northing = ref(0);
const altitude = ref(0);
const zoomLevel = ref(0);
const heading = ref(0);
const pitch = ref(0);
const eyeHeight = ref(0);
const frameRateFPS = ref<number | string>(0);
const frameRateMS = ref<number | string>(0);
// 获取 Cesium 视图对象
let viewer: Cesium.Viewer | undefined = props.viewer;
const FPSInfo = new GetFPSInfo();
// 初始化状态栏
onMounted(() => {
  // 假设已经初始化了 Cesium 视图
  viewer = props.viewer

  // 更新状态栏信息
  updateStatus();

  // 监听相机变化
  viewer?.scene.camera.changed.addEventListener(updateStatus);
});

// 更新状态栏信息
function updateStatus() {
  if (viewer) {
    const position = viewer.camera.positionWC;
    const ellipsoid = Cesium.Ellipsoid.WGS84;
    const cartographic = Cesium.Cartographic.fromCartesian(position, ellipsoid);

    longitude.value = Cesium.Math.toDegrees(cartographic.longitude);
    latitude.value = Cesium.Math.toDegrees(cartographic.latitude);
    eyeHeight.value = cartographic.height;

    heading.value = Cesium.Math.toDegrees(viewer.camera.heading);
    pitch.value = Cesium.Math.toDegrees(viewer.camera.pitch);
    let info = FPSInfo.update();
    frameRateFPS.value = info.fps
    frameRateMS.value = info.ms
    zoomLevel.value = viewer.camera.positionCartographic.height;
  }
}
function updatePosition() {
  
}

// 清理工作
onUnmounted(() => {
  if (viewer) {
    viewer.scene.camera.changed.removeEventListener(updateStatus);
  }
});
</script>

<style scoped lang="scss">
.status-bar {
  position: absolute;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  bottom: 0px;
  left: 0px;
  width: 100%;
  background-color: #6f6f6fb3;
  padding: 5px 0;

  div {
    margin: 0 10px;
  }
}
</style>