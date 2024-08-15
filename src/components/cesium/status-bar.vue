<template>
  <div class="status-bar flex">
    <div class="flex">
      <div>经度: {{ longitude.toFixed(6) }}</div>
      <div>纬度: {{ latitude.toFixed(6) }}</div>
      <div>海拔：{{ altitude.toFixed(2) }} 米</div>
    </div>
    <div class="flex">
      <div>方向：{{ heading.toFixed(2) }}°</div>
      <div>俯仰角：{{ pitch.toFixed(2) }}°</div>
      <div>视高：{{ eyeHeight.toFixed(2) }} 米</div>
    </div>
    <div class="flex">
      <div>帧率：{{ frameRateFPS }} FPS</div>
      <div>延迟：{{ frameRateMS }} MS</div>
    </div>
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
// const easting = ref(0);
// const northing = ref(0);
const altitude = ref(0);
// const zoomLevel = ref(0);
const heading = ref(0);
const pitch = ref(0);
const eyeHeight = ref(0);
const frameRateFPS = ref<number | string>(0);
const frameRateMS = ref<number | string>(0);
// 获取 Cesium 视图对象
let viewer: Cesium.Viewer | undefined;
let FPSInfo = new GetFPSInfo();
// 初始化状态栏
onMounted(() => {
  viewer = props.viewer
  // 更新状态栏信息
  if (viewer) {
    // 监听相机变化
    viewer?.scene.camera.changed.addEventListener(updateStatus);
    // 监听渲染
    viewer?.scene.postRender.addEventListener(updateFPS)
    // 监听鼠标移动
    viewer?.screenSpaceEventHandler.setInputAction(updatePosition, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }
});

// 更新状态栏信息
const updateStatus = throttle(() => {
  if (viewer) {
    eyeHeight.value = viewer.camera.positionCartographic.height;

    heading.value = Cesium.Math.toDegrees(viewer.camera.heading);
    pitch.value = Cesium.Math.toDegrees(viewer.camera.pitch);
  }
}, 200)

const updateFPS = throttle(() => {
  if (viewer) {
    let info = FPSInfo.update();
    frameRateFPS.value = info.fps
    frameRateMS.value = info.ms
  }
}, 200)
const updatePosition = throttle((movement: { endPosition: Cesium.Cartesian2 }) => {
  // 获取鼠标在屏幕上的位置
  const screenPosition = movement.endPosition;
  // 将屏幕位置转换为经纬度
  const cartesian = viewer?.scene.globe.pick(viewer.camera.getPickRay(screenPosition), viewer.scene);
  if (cartesian) {
    const cartographic = viewer?.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
    longitude.value = Cesium.Math.toDegrees(cartographic.longitude);
    latitude.value = Cesium.Math.toDegrees(cartographic.latitude);
    altitude.value = cartographic.height;
  }
}, 200)
type ThrottleOrDebounceFunction<T extends (...args: any[]) => any> = T & {
  cancel?: () => void;
  flush?: () => void;
};
function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ThrottleOrDebounceFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;

  const throttled = function (this: any, ...args: Parameters<T>): void {
    const context = this;
    const now = Date.now();

    if (now - previous > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      func.apply(context, args);
      previous = now;
    } else if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(context, args);
        previous = now;
      }, wait - (now - previous));
    }
  };

  throttled.cancel = function (): void {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return throttled as ThrottleOrDebounceFunction<T>;
}
// 清理工作
onUnmounted(() => {
  if (viewer) {
    FPSInfo = new GetFPSInfo();
    viewer.scene.camera.changed.removeEventListener(updateStatus);
    viewer.scene.postRender.removeEventListener(updateFPS)
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
});
</script>

<style scoped lang="scss">
.status-bar {
  position: absolute;
  display: flex;
  justify-content: space-between;
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