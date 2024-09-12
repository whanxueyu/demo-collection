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
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, defineEmits } from "vue";
import baseMapIcon from '@/static/baseMap/index.js';
import AmapMercatorTilingScheme from '@/modules/AmapMercatorTilingScheme/AmapMercatorTilingScheme';
import * as Cesium from "cesium";
const showMap = ref(false)
const props = defineProps({
    viewer: {
        type: Cesium.Viewer,
        required: true
    },
    // 默认地图类型
    mapType: {
        type: String,
        default: 'tdt'
    }
})
var viewer: Cesium.Viewer | undefined = props.viewer;
const mapData = reactive({
    mapType: props.mapType,
    mapName: '',
    mapIcon: '',
})
const baseMapList = [
    { id: 1, name: '天地图影像', type: 'tdt', icon: baseMapIcon.tdt_img },
    { id: 2, name: '高德影像', type: 'gd', icon: baseMapIcon.gaode_img },
    { id: 3, name: '天地图矢量', type: 'tdt_v', icon: baseMapIcon.tdt_vec },
    { id: 4, name: '高德矢量', type: 'gd_v', icon: baseMapIcon.gaode_vec },
    { id: 5, name: 'Bing路网', type: 'BingRoad', icon: baseMapIcon.bing_vec },
    { id: 6, name: 'Bing影像', type: 'BingAerial', icon: baseMapIcon.bing_img },
    { id: 7, name: '网格', type: 'grid', icon: baseMapIcon.earth },
    { id: 8, name: '瓦片网格', type: 'tileGrid', icon: baseMapIcon.grid },
]

const changeMapType = (map) => {
    mapData.mapType = map.type;
    mapData.mapName = map.name;
    mapData.mapIcon = map.icon;
    changeBaseMap(mapData.mapType)
}
const changeBaseMap = async (type) => {
    if (viewer.imageryLayers.length > 0)
        viewer.imageryLayers.removeAll();
    restoreTerrain()
    if (type == 'tdt') {
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
            maximumLevel: 18,
        })
        viewer.imageryLayers.addImageryProvider(tdtMap)
    } else if (type == 'gd') {
        let gdMap = new Cesium.UrlTemplateImageryProvider({
            url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}&lang=zh_cn',
            tileWidth: 256,
            tileHeight: 256,
            tilingScheme: new AmapMercatorTilingScheme(),
            maximumLevel: 18, // 根据高德地图的实际最大层级设置  
        })
        viewer.imageryLayers.addImageryProvider(gdMap)
    } else if (type == 'gd_v') {
        let gdvMap = new Cesium.UrlTemplateImageryProvider({
            url: 'https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=2&style=8&x={x}&y={y}&z={z}',
            tileWidth: 256,
            tileHeight: 256,
            tilingScheme: new AmapMercatorTilingScheme(),
            maximumLevel: 18, // 根据高德地图的实际最大层级设置  
        })
        viewer.imageryLayers.addImageryProvider(gdvMap)
    } else if (type == 'tdt_v') {

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
    } else if (type == 'BingRoad') {
        viewer.imageryLayers.addImageryProvider(
            await Cesium.IonImageryProvider.fromAssetId(4),
        );
    } else if (type == 'BingAerial') {
        viewer.imageryLayers.addImageryProvider(
            await Cesium.IonImageryProvider.fromAssetId(2),
        );
    } else if (type == 'grid') {
        let gridOptions = {
            color: Cesium.Color.fromCssColorString('#ccc'),
            backgroundColor: Cesium.Color.fromCssColorString('#00000000'),
            glowColor: Cesium.Color.fromCssColorString('#666'),
            glowWidth: 1,
            cells: 2
        }
        var GridImagery = new Cesium.GridImageryProvider(gridOptions);
        viewer.imageryLayers.addImageryProvider(GridImagery);
        viewer.scene.globe.baseColor = Cesium.Color.BLACK;
        removeTerrain()

    }else if(type == 'tileGrid'){
        var TileGridImagery = new Cesium.TileCoordinatesImageryProvider({color: Cesium.Color.fromCssColorString('#ccc')});
        viewer.imageryLayers.addImageryProvider(TileGridImagery);
        viewer.scene.globe.baseColor = Cesium.Color.BLACK;
        removeTerrain()
    }
}
const currentTerrainProvider = ref(null)
function removeTerrain() {
    // 获取当前地形提供者
    currentTerrainProvider.value = viewer.scene.terrainProvider;

    if (currentTerrainProvider.value) {
        // 如果当前地形提供者存在，则移除它
        viewer.scene.terrainProvider = undefined;
    }

    // 或者替换为一个空的地形提供者
    viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider();
}
function restoreTerrain() {
    if (currentTerrainProvider.value) {
        viewer.scene.terrainProvider = currentTerrainProvider.value;
    }
}
const findMapDetails = () => {
    const map = baseMapList.find((item) => item.type === mapData.mapType);
    if (map) {
        mapData.mapName = map.name;
        mapData.mapIcon = map.icon;
    }
};
onMounted(() => {
    viewer = props.viewer
    findMapDetails()
    changeBaseMap(mapData.mapType)
})
</script>
<style lang="scss" scoped>
.baseMap {
    position: fixed;
    right: 10px;
    bottom: 30px;
    z-index: 999;
    display: flex;

    .baseMap-item {
        width: 80px;
        height: 80px;
        text-align: center;
        // line-height: 60px;
        color: #fff;
        border: 1px solid #092131cc;
        cursor: pointer;

        &:hover {
            border: 1px solid #9c7a1d8e;
        }

        &.active {
            border: 1px solid #ffbb00;
        }

        .icon {
            width: 80px;
            height: 60px;
        }

        .mapname {
            line-height: 18px;
            background-color: #00b8ffad;
            width: 80px;
            height: 18px;
        }
    }
}
</style>