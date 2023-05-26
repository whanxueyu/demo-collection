<template>
    <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>
   
<script>
import { nextTick, onMounted } from "vue";
import * as Cesium from "cesium";
import 'cesium/Source/Widgets/widgets.css';
var viewer;
//定义一些常量
// var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;
export default {
    setup() {
        const initCesium = () => {
            Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxZDU4MDE4ZS03ODdmLTQ1NWMtYTI3Ny1kMmQxNmVkYmQxZDQiLCJpZCI6NjMxNjUsImlhdCI6MTYzMjg3OTg1NX0.AAtivmdf46L1-4MWLWjnQRgP_laeTXBMagA75_a9N9o";
            // 高德地图影像图
            var atLayer = new Cesium.UrlTemplateImageryProvider({
                // url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}", //高德影像
                // url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", //高德矢量图
                url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8", //高德路网中文注记
                minimumLevel: 1,
                maximumLevel: 18
            })
            var atLayer1 = new Cesium.UrlTemplateImageryProvider({
                url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}", //高德影像
                // url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", //高德矢量图
                // url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8", //高德路网中文注记
                minimumLevel: 1,
                maximumLevel: 18
            })
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
            });
            viewer.imageryLayers.addImageryProvider(atLayer1);
            viewer.imageryLayers.addImageryProvider(atLayer);
            viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
            viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG];
            viewer.cesiumWidget.creditContainer.style.display = "none";
            // viewer.scene.screenSpaceCameraController.enableTranslate = false;
            viewer.scene.screenSpaceCameraController.enableRotate = true; //拖拽旋转
            viewer.scene.screenSpaceCameraController.enableTilt = true; //右键拖拽倾斜
            let location = gcj02towgs84(117.09022, 39.09498)
            console.log(location)
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(117.09022, 39.09498, 600),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-60),
                    roll: 0.0,
                },
            });
            nextTick(()=>{
                addMark()
            })
        }
        const addMark = () => {
            viewer.entities.add({
                name: '公司',
                position: Cesium.Cartesian3.fromDegrees(117.09522, 39.1039,20),
                billboard: {
                    image: require('../../assets/icon/company.png'),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    scale: 0.5,
                }
            })
            viewer.entities.add({
                name: '房子',
                position: Cesium.Cartesian3.fromDegrees(117.03173 , 39.08377,100),
                billboard: {
                    image: require('../../assets/icon/house.png'),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    scale: 0.5,
                }
            })
            viewer.entities.add({
                name: '天安门',
                position: Cesium.Cartesian3.fromDegrees(116.40264 , 39.9133,100),
                billboard: {
                    image: require('../../assets/icon/star.png'),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    scale: 0.5,
                }
            })
            viewer.entities.add({
                name: '家',
                position: Cesium.Cartesian3.fromDegrees(103.96630 , 35.80499,100),
                billboard: {
                    image: require('../../assets/icon/home.png'),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    scale: 0.5,
                }
            })
        }
        const gcj02towgs84 = (lng, lat) => {
            if (out_of_china(lng, lat)) {
                return [lng, lat]
            }
            else {
                var dlat = transformlat(lng - 105.0, lat - 35.0);
                var dlng = transformlng(lng - 105.0, lat - 35.0);
                var radlat = lat / 180.0 * PI;
                var magic = Math.sin(radlat);
                magic = 1 - ee * magic * magic;
                var sqrtmagic = Math.sqrt(magic);
                dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
                dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
                var mglat = lat + dlat;
                var mglng = lng + dlng;
                return [lng * 2 - mglng, lat * 2 - mglat]
            }
        }
        const transformlat = (lng, lat) => {
            var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
            return ret
        }

        const transformlng = (lng, lat) => {
            var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
            return ret
        }
        const out_of_china = (lng, lat) => {
            return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
        }
        onMounted(() => {
            initCesium()
        })
    }
}
</script>
   
<style>
#cesiumContainer {
    width: 100vw;
    height: calc(100vh - 60px);
}
</style>