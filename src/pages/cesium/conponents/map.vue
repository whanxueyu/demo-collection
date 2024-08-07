<template>
    <div class="baseMap" @mouseenter="showMap = true" @mouseleave="showMap = false">
        <div class="baseMap-item active" v-if="!showMap">
            <img class="icon" :src="mapData.mapIcon" alt="">
            <div class="mapname">{{ mapData.mapName }}</div>
        </div>
        <div v-else :class="mapData.mapType === item.type ? 'baseMap-item active' : 'baseMap-item'"
            @click="changeMapType(item)" v-for="item in baseMapList" :key="item.id">
            <img class="icon" :src="item.icon" alt="">
            <div class="mapname">{{ item.name }}</div>
        </div>
    </div>
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
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, defineEmits } from "vue";
import * as Cesium from "cesium";
import 'cesium/Source/Widgets/widgets.css';
import { useMouse, onClickOutside } from '@vueuse/core'

import AmapMercatorTilingScheme from '@/modules/AmapMercatorTilingScheme/AmapMercatorTilingScheme';
import tdt_img from '@/static/img/tdt_img.png';
import tdt_vec from '@/static/img/tdt_vec.png';
import gaode_vec from '@/static/img/gaode_vec.png';
import gaode_img from '@/static/img/gaode_img.png';
var viewer;
const emits = defineEmits(['loaded'])
const mapData = reactive({
    mapType: 'tdt',
    mapName: '天地图影像',
    mapIcon: tdt_img,
})
const baseMapList = [
    { id: 1, name: '天地图影像', type: 'tdt', icon: tdt_img },
    { id: 2, name: '高德影像', type: 'gd', icon: gaode_img },
    { id: 2, name: '天地图矢量', type: 'tdt_v', icon: tdt_vec },
    { id: 2, name: '高德矢量', type: 'gd_v', icon: gaode_vec },
]
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
const showMap = ref(false)
const dialogVisible = ref(false)
const markerArr = reactive({
    list: []
})
const initCesium = () => {
    // Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxZDU4MDE4ZS03ODdmLTQ1NWMtYTI3Ny1kMmQxNmVkYmQxZDQiLCJpZCI6NjMxNjUsImlhdCI6MTYzMjg3OTg1NX0.AAtivmdf46L1-4MWLWjnQRgP_laeTXBMagA75_a9N9o";
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
    if (viewer)
        changeBaseMap()
    viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
    viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG];
    viewer.cesiumWidget.creditContainer.style.display = "none";
    // viewer.scene.screenSpaceCameraController.enableTranslate = false;
    viewer.scene.screenSpaceCameraController.enableRotate = true; //拖拽旋转
    viewer.scene.screenSpaceCameraController.enableTilt = true; //右键拖拽倾斜
    var helper = new Cesium.EventHelper();
    helper.add(viewer.scene.globe.tileLoadProgressEvent, function (e) {
        if (e == 0) {
            console.log("矢量切片加载完成时的回调");
            if (!mapData.loaded) {
                nextTick(() => {
                    // 首次加载完成
                    reset()
                })
                mapData.loaded = true;
                emits('loaded', viewer)
            }
        }
    });
    // 监听点击事件
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    // 右
    handler.setInputAction(function (click) {
        let pickedObject = viewer.scene.pick(click.position);
        if (Cesium.defined(pickedObject)) {
            console.log('点击了实体:', pickedObject);
            rightMenu(mouseData.x, mouseData.y, pickedObject)
        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}
const changeMapType = (map) => {
    mapData.mapType = map.type;
    mapData.mapName = map.name;
    mapData.mapIcon = map.icon;
    changeBaseMap()
}
const changeBaseMap = () => {
    if (viewer.imageryLayers.length > 0)
        viewer.imageryLayers.removeAll();
    if (mapData.mapType == 'tdt') {
        let tdtMap = new Cesium.WebMapTileServiceImageryProvider({
            //影像底图
            url:
                'https://t{s}.tianditu.gov.cn/img_w/wmts?service=WMTS&request=GetTile&version=1.0.0&layer=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
                '436ce7e50d27eede2f2929307e6b33c0',
            subdomains: ['1', '2', '3', '4', '5', '6', '7'],//URL模板中用于{s}占位符的子域。如果该参数是单个字符串，则字符串中的每个字符都是一个子域。如果它是一个数组，数组中的每个元素都是一个子域
            layer: 'tdt_imgLayer',
            style: 'default',
            format: 'image/jpeg',
            tileWidth: 256,
            tileHeight: 256,
            tileMatrixSetID: 'GoogleMapsCompatible', //使用谷歌的瓦片切片方式
            show: true,
            maximumLevel: 24,
        })
        viewer.imageryLayers.addImageryProvider(tdtMap)
    } else if (mapData.mapType == 'gd') {
        let gdMap = new Cesium.UrlTemplateImageryProvider({
            url: 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}&lang=zh_cn&size=1',
            subdomains: ['1', '2', '3', '4', '5', '6', '7'],// 如果有多个子域名用于负载均衡，可以在这里指定  
            tileWidth: 256,
            tileHeight: 256,
            tilingScheme: new AmapMercatorTilingScheme(),
            maximumLevel: 24, // 根据高德地图的实际最大层级设置  
        })
        viewer.imageryLayers.addImageryProvider(gdMap)
    } else if (mapData.mapType == 'gd_v') {
        let gdvMap = new Cesium.UrlTemplateImageryProvider({
            url: 'https://webst0{s}.is.autonavi.com/appmaptile?style=7&scl=1&ltype=0&x={x}&y={y}&z={z}&lang=zh_cn&size=1',
            subdomains: ['1', '2', '3', '4', '5', '6', '7'], // 如果有多个子域名用于负载均衡，可以在这里指定  
            tileWidth: 256,
            tileHeight: 256,
            tilingScheme: new AmapMercatorTilingScheme(),
            maximumLevel: 24, // 根据高德地图的实际最大层级设置  
        })
        viewer.imageryLayers.addImageryProvider(gdvMap)
    } else if (mapData.mapType == 'tdt_v') {

        let tdtMap = new Cesium.WebMapTileServiceImageryProvider({
            //影像底图
            url:
                'https://t{s}.tianditu.gov.cn/vec_w/wmts?service=WMTS&request=GetTile&version=1.0.0&layer=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
                '436ce7e50d27eede2f2929307e6b33c0',
            subdomains: ['1', '2', '3', '4', '5', '6', '7'],//URL模板中用于{s}占位符的子域。如果该参数是单个字符串，则字符串中的每个字符都是一个子域。如果它是一个数组，数组中的每个元素都是一个子域
            layer: 'tdt_imgLayer',
            style: 'default',
            tileWidth: 256,
            tileHeight: 256,
            tileMatrixSetID: 'GoogleMapsCompatible', //使用谷歌的瓦片切片方式
            maximumLevel: 24,
        })
        viewer.imageryLayers.addImageryProvider(tdtMap)
    }
}
const reset = () => {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.391257, 39.907204, 1000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0,
        },
        duration: 8
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

.menubox {
    position: absolute;
    z-index: 999;
    border-bottom-right-radius: 10px;
    padding: 20px;

    .tab-body {
        width: 250px;

        .text {
            line-height: 24px;
            text-indent: 24px;
            text-align: start;
        }
    }
}

.addition {
    position: absolute;
    z-index: 999;
    border-bottom-right-radius: 10px;
    padding: 20px;
    left: 300px;

    .menuBtn {
        color: #A3A6AD;
        font-size: 18px;
        margin-right: 10px;
        padding: 10px;
        cursor: pointer;
        background-color: #333436;

        &:hover {
            background-color: #1d1e1f;
        }

        &.active {
            color: #409eff;
            background-color: #1d1e1f;
        }
    }
}

.baseMap {
    position: fixed;
    right: 10px;
    bottom: 10px;
    z-index: 999;
    display: flex;

    .baseMap-item {
        width: 80px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        color: #fff;
        background-color: #092131cc;
        border: 2px solid #092131cc;
        cursor: pointer;

        &:hover {
            border: 2px solid #9c7a1d8e;
        }

        &.active {
            background-color: #268dd1cc;
            border: 2px solid #9c7a1df3;
        }

        .icon {
            width: 80px;
            height: 60px;
        }

        .mapname {
            margin-top: -52px;
            text-shadow: #232119 2px 2px 6px;
            line-height: 20px;
        }
    }
}

.row {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}

.popmenu {
    position: fixed;
    z-index: 1004;
    background-color: rgba(9, 33, 49, 0.8);
    padding: 5px 10px;
    border-radius: 2px;
}

.colorSection {
    margin-top: 10px;

    .sectiontitle {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        align-items: center;
    }
}
</style>