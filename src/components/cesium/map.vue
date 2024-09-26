<template>
    <!-- 右键菜单 -->
    <div class="popmenu" ref="target" v-if="showMenu" :style="{ 'left': position.x + 'px', 'top': position.y + 'px' }">
        <div>
            <el-button @click="remove" link>删除</el-button>
        </div>
        <div>
            <el-button @click="showInfo" link>信息</el-button>
        </div>
    </div>
    <!-- 信息弹窗 -->
    <el-dialog v-model="dialogVisible" title="标记信息" width="300px" :before-close="handleClose">
        <el-descriptions column=1 border>
            <el-descriptions-item label="经度">{{ position.currentEntities.lng }}</el-descriptions-item>
            <el-descriptions-item label="纬度">{{ position.currentEntities.lat }}</el-descriptions-item>
            <el-descriptions-item label="标记类型">{{ position.currentEntities.name }}</el-descriptions-item>
            <el-descriptions-item label="标记ID">{{ position.currentEntities.id }}</el-descriptions-item>
        </el-descriptions>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose" type="primary">ok</el-button>
            </span>
        </template>
    </el-dialog>
    <div id="cesiumContainer" ref="cesiumContainer"></div>
    <base-layer v-if="mapLoaded" :viewer="viewer" :map-type="props.mapType"></base-layer>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, defineEmits } from "vue";
import * as Cesium from "cesium";
import 'cesium/Source/Widgets/widgets.css';
import { useMouse, onClickOutside } from '@vueuse/core'
import baseLayer from '@/components/cesium/baseLayer.vue'
import Compass from '@/modules/compass/compass.ts'
var viewer;
const props = defineProps({
    // 默认经纬度
    lazy: {
        type: Boolean,
        default: true
    },
    duration: {
        type: Number,
        default: 8
    },
    // 默认地图类型
    mapType: {
        type: String,
        default: 'tdt'
    }
})
const emits = defineEmits(['loaded'])

const mouseData = reactive(useMouse())

const position = reactive({
    x: 0,
    y: 0,
    currentEntities: {
        id: '',
        name: '',
        lng: '',
        lat: '',
    }
})
const target = ref(null)
const showMenu = ref(false)
const dialogVisible = ref(false)
const markerArr = reactive({
    list: []
})
const mapLoaded = ref(false)
const initCesium = () => {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMjBkODk3NS0xZmE4LTQ5MzgtYTAxZC1mZTZhZTVmMTY3ZjQiLCJpZCI6MTcwNzE3LCJpYXQiOjE2OTY4MTY5OTN9.YivsBCkT8fHJNB5lFMFo2bh7860luv368ALHw-_gCD0";
    viewer = new Cesium.Viewer("cesiumContainer", {
        infoBox: false,
        selectionIndicator: false,
        sceneModePicker: false,
        animation: false,    //左下角的动画仪表盘
        baseLayerPicker: false,  //右上角的图层选择按钮
        geocoder: false,  //搜索框
        homeButton: false,  //home按钮
        timeline: false,    //底部的时间轴
        navigationHelpButton: false,  //右上角的帮助按钮，
        fullscreenButton: false,
        imageryProvider: new Cesium.SingleTileImageryProvider({
            url:
                "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==",
            tileWidth: 256,
            tileHeight: 256,
        }),
        terrain: Cesium.Terrain.fromWorldTerrain({
            requestWaterMask: true,
            requestVertexNormals: true,
        }),
    });
    viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
    viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG];
    viewer.cesiumWidget.creditContainer.style.display = "none";
    // viewer.scene.screenSpaceCameraController.enableTranslate = false;
    viewer.scene.screenSpaceCameraController.enableRotate = true; //拖拽旋转
    viewer.scene.screenSpaceCameraController.enableTilt = true; //右键拖拽倾斜
    new Compass(viewer)
    var helper = new Cesium.EventHelper();
    if (props.lazy) {
        helper.add(viewer.scene.globe.tileLoadProgressEvent, function (e) {
            if (e == 0) {
                console.log("矢量切片加载完成时的回调");
                if (!mapLoaded.value) {
                    nextTick(() => {
                        // 首次加载完成
                        reset()
                    })
                    mapLoaded.value = true;
                    emits('loaded', viewer)
                }
            }
        });
    } else {
        reset()
        mapLoaded.value = true;
        emits('loaded', viewer)
    }

    // 监听点击事件
    // let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    // // 右
    // handler.setInputAction(function (click) {
    //     let pickedObject = viewer.scene.pick(click.position);
    //     if (Cesium.defined(pickedObject)) {
    //         console.log('点击了实体:', pickedObject);
    //         rightMenu(mouseData.x, mouseData.y, pickedObject)
    //     }
    // }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}
const reset = () => {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(105, 35, 10000000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0,
        },
        duration: props.duration
    });
}
const saveMarkers = () => {
    sessionStorage.setItem("markers", JSON.stringify(markerArr.list))
}
const remove = () => {
    viewer.entities.removeById(position.currentEntities.id)
    markerArr.list = markerArr.list.filter((item) => {
        return item.longitude !== position.currentEntities.lng && item.latitude !== position.currentEntities.lat
    })
    showMenu.value = false
    saveMarkers()
}
const showInfo = () => {
    dialogVisible.value = true
}
const rightMenu = (x, y, obj) => {
    position.x = x;
    position.y = y;
    position.currentEntities.id = obj.id._id;
    position.currentEntities.name = obj.id.name;
    let cartographic = Cesium.Cartographic.fromCartesian(obj.primitive._actualPosition);
    let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
    let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
    position.currentEntities.lng = lng.toFixed(4);
    position.currentEntities.lat = lat.toFixed(4);
    showMenu.value = true
}
const handleClose = () => {
    showMenu.value = false
    dialogVisible.value = false
}
onMounted(() => {
    // 禁用浏览器默认右键菜单，避免与自定义操作冲突
    document.oncontextmenu = new Function("event.returnValue=false");
    initCesium()
    // 监听点击目标元素外部事件
    onClickOutside(target, handleClose)
})
</script>

<style lang="scss" scoped>
#cesiumContainer {
    width: 100vw;
    height: calc(100vh - 60px);
}


.popmenu {
    position: fixed;
    z-index: 1004;
    background-color: rgba(9, 33, 49, 0.8);
    padding: 5px 10px;
    border-radius: 2px;
}
</style>