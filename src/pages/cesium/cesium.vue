<template>
    <div class="menubox">
        <div class="row">
            <el-checkbox v-model="mapData.showMark" label="开启标记" />
            <el-button type="primary" @click="saveAll">保存标记</el-button>
            <el-button type="danger" @click="removeAll">清除全部</el-button>
        </div>
        <div class="row">
            <el-radio-group v-model="mapData.markIcon">
                <el-radio :label="1">
                    <el-image style="width: 40px; height: 40px" :src="marker" fit="fill" />
                </el-radio>
                <el-radio :label="2">
                    <el-image style="width: 40px; height: 40px" :src="pin" fit="fill" /></el-radio>
                <el-radio :label="3">
                    <el-image style="width: 40px; height: 40px" :src="flag" fit="fill" />
                </el-radio>
                <el-radio :label="4">
                    <el-image style="width: 40px; height: 40px" :src="star" fit="fill" />
                </el-radio>
            </el-radio-group>
        </div>
    </div>
    <div class="popmenu" ref="target" v-if="showMenu" :style="{ 'left': position.x + 'px', 'top': position.y + 'px' }">
        <div>
            <el-button @click="remove" link>删除</el-button>
        </div>
        <div>
            <el-button @click="showInfo" link>信息</el-button>
        </div>
    </div>
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
   
<script>
import { nextTick, onMounted, reactive, ref } from "vue";
import * as Cesium from "cesium";
import 'cesium/Source/Widgets/widgets.css';
import { useMouse, onClickOutside } from '@vueuse/core'
var viewer;
//定义一些常量
// var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;
export default {
    setup() {
        const mapData = reactive({
            mapType: '1',
            markType: '1',
            mapLayer: {},
            markLayer: {},
            showMark: true,
            markIcon: 1,
            loaded: false
        })
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
        const tilesets = [
            './3dTileset/a/tileset.json',
            './3dTileset/b/tileset.json',
            './3dTileset/c/tileset.json',
            './3dTileset/d/tileset.json',
            './3dTileset/e/tileset.json',
            './3dTileset/f/tileset.json',
            './3dTileset/g/tileset.json',
            './3dTileset/h/tileset.json',
            './3dTileset/i/tileset.json',
            './3dTileset/j/tileset.json',
            './3dTileset/k/tileset.json',
            './3dTileset/l/tileset.json',
            './3dTileset/m/tileset.json',
            './3dTileset/n/tileset.json',
            './3dTileset/o/tileset.json',
            './3dTileset/p/tileset.json',
            './3dTileset/q/tileset.json',
            './3dTileset/r/tileset.json',
            './3dTileset/s/tileset.json',
            './3dTileset/t/tileset.json',
            './3dTileset/u/tileset.json',
            './3dTileset/v/tileset.json',
            './3dTileset/w/tileset.json',
            './3dTileset/x/tileset.json',
            './3dTileset/y/tileset.json',
            './3dTileset/z/tileset.json',
            './3dTileset/aa/tileset.json',
            './3dTileset/ab/tileset.json',
            './3dTileset/ac/tileset.json',
            './3dTileset/ad/tileset.json',
        ]
        const marker = require('@/assets/icon/marker.png')
        const flag = require('@/assets/icon/flag.png')
        const pin = require('@/assets/icon/pin.png')
        const star = require('@/assets/icon/star.png')
        const initCesium = () => {
            Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxZDU4MDE4ZS03ODdmLTQ1NWMtYTI3Ny1kMmQxNmVkYmQxZDQiLCJpZCI6NjMxNjUsImlhdCI6MTYzMjg3OTg1NX0.AAtivmdf46L1-4MWLWjnQRgP_laeTXBMagA75_a9N9o";
            // // 高德影像
            // var mapLayer = new Cesium.UrlTemplateImageryProvider({
            //     url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}", //高德影像
            //     minimumLevel: 1,
            //     maximumLevel: 18
            // })
            // // 高德路网中文注记
            // var markLayer = new Cesium.UrlTemplateImageryProvider({
            //     url: "https://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8", //高德路网中文注记
            //     minimumLevel: 1,
            //     maximumLevel: 18
            // })
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
            
            // 服务负载子域
            var subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];
            // viewer.imageryLayers.addImageryProvider(
            //     new Cesium.WebMapTileServiceImageryProvider({
            //         //影像底图
            //         url: "http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=indigo&format=tiles&tk=841234cd0d023af5c1bcb7c3d2c453c6",
            //         subdomains: subdomains,
            //         layer: "tdtImgLayer",
            //         style: "default",
            //         format: "image/jpeg",
            //         tileMatrixSetID: "GoogleMapsCompatible", //使用谷歌的瓦片切片方式
            //         show: true,
            //     })
            // );
            // viewer.imageryLayers.addImageryProvider(mapLayer);
            // viewer.imageryLayers.addImageryProvider(markLayer);
            // viewer.imageryLayers.addImageryProvider(
            //     new Cesium.WebMapTileServiceImageryProvider({
            //         //影像底图
            //         url: "http://t{s}.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=indigo&format=tiles&tk=841234cd0d023af5c1bcb7c3d2c453c6",
            //         subdomains: subdomains,
            //         layer: "tdtImgLayer",
            //         style: "default",
            //         format: "image/jpeg",
            //         tileMatrixSetID: "GoogleMapsCompatible", //使用谷歌的瓦片切片方式
            //         show: true,
            //     })
            // );
            viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        // 加载多个图层
        url: "http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=841234cd0d023af5c1bcb7c3d2c453c6",
        subdomains: subdomains,
        layer: "tdtCiaLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: true,
      })
    );
            
            viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
            viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG];
            viewer.cesiumWidget.creditContainer.style.display = "none";
            // viewer.scene.screenSpaceCameraController.enableTranslate = false;
            viewer.scene.screenSpaceCameraController.enableRotate = true; //拖拽旋转
            viewer.scene.screenSpaceCameraController.enableTilt = false; //右键拖拽倾斜
            var helper = new Cesium.EventHelper();
            helper.add(viewer.scene.globe.tileLoadProgressEvent, function (e) {
                if (e == 0) {
                    console.log("矢量切片加载完成时的回调");
                    if (!mapData.loaded) {
                        nextTick(() => {
                            // viewer.camera.flyTo({
                            //     destination: Cesium.Cartesian3.fromDegrees(116.39746, 39.9092, 1000),
                            //     orientation: {
                            //         heading: Cesium.Math.toRadians(0),
                            //         pitch: Cesium.Math.toRadians(-90),
                            //         roll: 0.0,
                            //     },
                            //     duration: 8
                            // });
                            const tileset = new Cesium.Cesium3DTileset({
                                url: "https://zouyaoji.top/vue-cesium/SampleData/Cesium3DTiles/Tilesets/dayanta/tileset.json",

                            });
                            viewer.scene.primitives.add(tileset);
                            viewer.zoomTo(tileset);
                        })
                        mapData.loaded = true
                    }
                }
            });
            // 
            let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction(function (event) {
                let ray = viewer.camera.getPickRay(event.position);
                let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
                let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
                let coordinate = {
                    longitude: Number(lng.toFixed(6)),
                    latitude: Number(lat.toFixed(6)),
                };
                console.log("origin", coordinate);
                addMark(coordinate.longitude, coordinate.latitude)

            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            handler.setInputAction(function (click) {
                let pickedObject = viewer.scene.pick(click.position);
                if (Cesium.defined(pickedObject)) {
                    console.log('点击了实体:', pickedObject);
                    rightMenu(mouseData.x, mouseData.y, pickedObject)
                }
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }
        const saveAll = () => {
            sessionStorage.setItem("markers", JSON.stringify(markerArr.list))
        }
        const removeAll = () => {
            viewer.entities.removeAll()
        }
        const remove = () => {
            viewer.entities.removeById(position.currentEntities.id)
            // todo
            markerArr.list = markerArr.list.filter((item) => {
                return item.longitude !== position.currentEntities.lng && item.latitude !== position.currentEntities.lat
            })
            showMenu.value = false
            saveAll()
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
        const addMark = (longitude, latitude) => {
            let icon = ''
            let name = ''
            if (mapData.showMark) {
                if (mapData.markIcon === 1) {
                    icon = marker
                    name = "marker"
                } else if (mapData.markIcon === 2) {
                    icon = pin
                    name = "pin"
                } else if (mapData.markIcon === 3) {
                    icon = flag
                    name = "flag"
                } else {
                    icon = star
                    name = "star"
                }
                viewer.entities.add({
                    name: name,
                    position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
                    billboard: {
                        image: icon,
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        scale: 0.5,
                    }
                })
                let obj = {
                    name: name,
                    longitude: longitude,
                    latitude: latitude
                }
                markerArr.list.push(obj)
            }
        }
        const defaultMark = (longitude, latitude, mark) => {
            let icon = ''
            let name = ''
            if (mapData.showMark) {
                if (mark === "marker") {
                    icon = marker
                } else if (mark === "pin") {
                    icon = pin
                } else if (mark === "flag") {
                    icon = flag
                } else {
                    icon = star
                }
                viewer.entities.add({
                    name: name,
                    position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
                    billboard: {
                        image: icon,
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        scale: 0.5,
                    }
                })
            }
        }
        const handleClose = () => {
            showMenu.value = false
            dialogVisible.value = false
        }
        const loadModel = () => {
            for (let i = 0; i < tilesets.length; i++) {
                Cesium.Cesium3DTileset.fromUrl(tilesets[i]).then(function (tileset) {
                    viewer.scene.primitives.add(tileset);
                    const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
                    const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
                    const m = Cesium.Transforms.eastNorthUpToFixedFrame(surface);
                    Cesium.Matrix4.multiplyByUniformScale(m, 1, m);
                    var mx = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(1)); //绕x轴旋转
                    var rotationZ = Cesium.Matrix4.fromRotationTranslation(mx);
                    Cesium.Matrix4.multiply(m, rotationZ, m);

                    const tempTranslation = new Cesium.Cartesian3(250, -230, -10);
                    const offset = Cesium.Matrix4.multiplyByPoint(m, tempTranslation, new Cesium.Cartesian3(0, 0, 0));
                    const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
                    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
                    shader(tileset)
                });
            }
        }
        const shader = (tile) => {
            console.log(tile)
            tile.style = new Cesium.Cesium3DTileStyle({
                color: {
                    conditions: [
                        ['true', 'rgba(0, 127.5, 255 ,0.4)']
                    ]
                }
            });
            tile.tileVisible.addEventListener(function (tile) {
                var content = tile.content;
                var featuresLength = content.featuresLength;
                for (let i = 0; i < featuresLength; i += 2) {
                    let feature = content.getFeature(i)
                    let model = feature.content._model

                    if (model && model._sourcePrograms && model._rendererResources) {
                        Object.keys(model._sourcePrograms).forEach(key => {
                            let program = model._sourcePrograms[key]
                            let fragmentShader = model._rendererResources.sourceShaders[program.fragmentShader];
                            let v_position = "";
                            if (fragmentShader.indexOf(" v_positionEC;") != -1) {
                                v_position = "v_positionEC";
                            } else if (fragmentShader.indexOf(" v_pos;") != -1) {
                                v_position = "v_pos";
                            }
                            const color = `vec4(${feature.color.toString()})`;

                            model._rendererResources.sourceShaders[program.fragmentShader] =
                                `
            varying vec3 ${v_position};
            void main(void){
              vec4 position = czm_inverseModelView * vec4(${v_position},1); // 位置
              gl_FragColor = ${color}; // 颜色
              gl_FragColor *= vec4(vec3(position.z / 50.0), 1.0); // 渐变
              // 动态光环
              float time = fract(czm_frameNumber / 180.0);
              time = abs(time - 0.5) * 2.0;
              float glowRange = 180.0; // 光环的移动范围(高度)
              float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
              gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
            }
          `
                        })
                        model._shouldRegenerateShaders = true
                    }
                }
            });
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
                return [mglng, mglat];
                // return [lng * 2 - mglng, lat * 2 - mglat]
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
            // 禁用浏览器默认右键菜单，避免与自定义操作冲突
            document.oncontextmenu = new Function("event.returnValue=false");
            initCesium()
            // 监听点击目标元素外部事件
            onClickOutside(target, (event) => {
                console.log(event)
                showMenu.value = false
            })
            markerArr.list = JSON.parse(sessionStorage.getItem("markers")) || []
            console.log(markerArr.list)
            if (markerArr.list.length > 0) {
                markerArr.list.forEach((item) => {
                    defaultMark(item.longitude, item.latitude, item.name)
                })
            }
        })
        return {
            mapData,
            mouseData,
            gcj02towgs84,
            shader,
            markerArr,
            loadModel,
            saveAll,
            removeAll,
            remove,
            rightMenu,
            showMenu,
            position,
            showInfo,
            target,
            marker,
            flag,
            pin,
            star,
            handleClose,
            dialogVisible
        }
    }
}
</script>
   
<style>
#cesiumContainer {
    width: 100vw;
    height: calc(100vh - 60px);
}

.menubox {
    position: absolute;
    z-index: 999;
    background-color: #000c;
    border-bottom-right-radius: 10px;
    padding: 10px 20px;
}

.row {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}

.popmenu {
    position: fixed;
    z-index: 1004;
    background-color: #000c;
    padding: 5px 10px;
    border-radius: 5px;
}
</style>