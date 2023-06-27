<template>
    <div class="menubox">
        <el-tabs type="border-card" class="demo-tabs">
            <el-tab-pane>
                <template #label>
                    <span class="custom-tabs-label">
                        <el-tooltip class="box-item" effect="dark" content="添加标记" placement="top">
                            <el-icon>
                                <LocationInformation />
                            </el-icon>
                        </el-tooltip>
                    </span>
                </template>
                <div class="tab-body">
                    <div class="row">
                        <el-checkbox v-model="mapData.showMark" label="开启标记" />
                        <el-button type="primary" @click="saveAll">保存标记</el-button>
                    </div>
                    <div class="row">
                        <el-radio-group v-model="mapData.markIcon" v-if="mapData.showMark">
                            <el-radio :label="1">
                                <el-image style="width: 24px; height: 24px" :src="marker" fit="fill" />
                            </el-radio>
                            <el-radio :label="2">
                                <el-image style="width: 24px; height: 24px" :src="pin" fit="fill" /></el-radio>
                            <el-radio :label="3">
                                <el-image style="width: 24px; height: 24px" :src="flag" fit="fill" />
                            </el-radio>
                            <el-radio :label="4">
                                <el-image style="width: 24px; height: 24px" :src="star" fit="fill" />
                            </el-radio>
                        </el-radio-group>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane>
                <template #label>
                    <span class="custom-tabs-label">
                        <el-tooltip class="box-item" effect="dark" content="管网数据" placement="top">
                            <el-icon>
                                <Rank />
                            </el-icon>
                        </el-tooltip>
                    </span>
                </template>
                <div class="tab-body">
                    <el-button type="warning" @click="loadPipenet">管网生成</el-button>
                    <el-divider content-position="left">说明</el-divider>
                    <div class="text">数据截取自某管网项目中极少的一部分，并对数据进行了修改，仅供学习参考，勿做其他用途</div>
                </div>
            </el-tab-pane>
            <el-tab-pane>
                <template #label>
                    <span class="custom-tabs-label">
                        <el-tooltip class="box-item" effect="dark" content="加载大雁塔模型" placement="top">
                            <el-icon>
                                <OfficeBuilding />
                            </el-icon>
                        </el-tooltip>
                    </span>
                </template>
                <div class="tab-body">
                    <el-button type="success" @click="load3DTileset">模型加载</el-button>
                    <el-divider content-position="left">说明</el-divider>
                    <div class="text">3DTileset模型资源使用的是在线数据，所以首次模型加载较慢</div>
                </div>
            </el-tab-pane>
            <el-tab-pane>
                <template #label>
                    <span class="custom-tabs-label">
                        <el-tooltip class="box-item" effect="dark" content="全部清除" placement="top">
                            <el-icon>
                                <Delete />
                            </el-icon>
                        </el-tooltip>
                    </span>
                </template>
                <div class="tab-body">
                    <el-button type="danger" @click="removeAll">清除全部</el-button>
                    <el-divider content-position="left">说明</el-divider>
                    <div class="text">将清除所有的实体，如标签、模型、管网等</div>
                </div>
            </el-tab-pane>
            <el-tab-pane>
                <template #label>
                    <span class="custom-tabs-label">
                        <el-tooltip class="box-item" effect="dark" content="初始位置" placement="top">
                            <el-icon>
                                <Refresh />
                            </el-icon>
                        </el-tooltip>
                    </span>
                </template>
                <div class="tab-body">
                    <el-button type="info" @click="reset">初始位置</el-button>
                    <el-divider content-position="left">说明</el-divider>
                    <div class="text">定位到天安门正上方</div>
                </div>
            </el-tab-pane>
        </el-tabs>
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
import { pointList, lineList, filterPoints, filterLines } from '@/static/fakedata/fakedata'
import { LocationInformation, Delete, Refresh, OfficeBuilding, Rank } from '@element-plus/icons-vue'
var viewer;
export default {
    components: {
        LocationInformation,
        Refresh,
        Delete,
        OfficeBuilding,
        Rank
    },
    setup() {
        const mapData = reactive({
            mapType: '1',
            markType: '1',
            mapLayer: {},
            markLayer: {},
            showMark: false,
            markIcon: 1,
            loaded: false,
            allLines: [],
            allPoints: []
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
        const marker = require('@/assets/icon/marker.png')
        const flag = require('@/assets/icon/flag.png')
        const pin = require('@/assets/icon/pin.png')
        const star = require('@/assets/icon/star.png')
        const initCesium = () => {
            Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxZDU4MDE4ZS03ODdmLTQ1NWMtYTI3Ny1kMmQxNmVkYmQxZDQiLCJpZCI6NjMxNjUsImlhdCI6MTYzMjg3OTg1NX0.AAtivmdf46L1-4MWLWjnQRgP_laeTXBMagA75_a9N9o";
            viewer = new Cesium.Viewer("cesiumContainer", {
                infoBox: false,
                selectionIndicator: false,
                sceneModePicker: false,
                animation: false,    //左下角的动画仪表盘
                baseLayerPicker: false,  //右上角的图层选择按钮
                geocoder: true,  //搜索框
                homeButton: true,  //home按钮
                timeline: false,    //底部的时间轴
                navigationHelpButton: false,  //右上角的帮助按钮，
                fullscreenButton: false,
            });

            // 服务负载子域
            var subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];
            viewer.imageryLayers.addImageryProvider(
                new Cesium.WebMapTileServiceImageryProvider({
                    // 加载多个图层
                    url: "https://t{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=841234cd0d023af5c1bcb7c3d2c453c6",
                    subdomains: subdomains,
                    layer: "tdtCiaLayer",
                    style: "default",
                    format: "image/jpeg",
                    tileMatrixSetID: "GoogleMapsCompatible",
                    show: true,
                    maximumLevel: 18
                })
            );
            viewer.imageryLayers.addImageryProvider(
                new Cesium.WebMapTileServiceImageryProvider({
                    // 加载多个图层
                    url: "https://t{s}.tianditu.gov.cn/cva_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=841234cd0d023af5c1bcb7c3d2c453c6",
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
                        mapData.loaded = true
                    }
                }
            });
            // 监听点击事件
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
                console.log("origin", coordinate.longitude, coordinate.latitude);
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
        const saveAll = () => {
            sessionStorage.setItem("markers", JSON.stringify(markerArr.list))
        }
        const removeAll = () => {
            viewer.entities.removeAll()
            sessionStorage.removeItem('markers')
        }
        const remove = () => {
            viewer.entities.removeById(position.currentEntities.id)
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
        // 加载3DTileset
        const load3DTileset = () => {
            const tilesets = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: "https://zouyaoji.top/vue-cesium/SampleData/Cesium3DTiles/Tilesets/dayanta/tileset.json",
            }));
            var height = 738.0
            tilesets.readyPromise
                .then(function (tileset) {
                    // 贴地
                    //计算中心点位置
                    var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
                    var lng = Cesium.Math.toDegrees(cartographic.longitude) //使用经纬度和弧度的转换，将WGS84弧度坐标系转换到目标值，弧度转度
                    var lat = Cesium.Math.toDegrees(cartographic.latitude)
                    // var lat = 34.219588
                    // var lng = 108.959397
                    //计算中心点位置的地表坐标
                    var surface = Cesium.Cartesian3.fromRadians(lng, lat, 0.0)
                    //偏移后的坐标
                    var offset = Cesium.Cartesian3.fromRadians(lng+0.0022, lat+0.0053, height)
                    var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
                    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
                })
            viewer.zoomTo(tilesets);
        }

        // 管点管线数据
        const loadPipenet = () => {
            let position = {
                lat: 38.986086,
                lng: 117.358494
            }
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(Number(position.lng), Number(position.lat), 1000), // 可见矩形
                duration: 3, //飞行时间
                orientation: {
                    heading: Cesium.Math.toRadians(0.0),
                    pitch: Cesium.Math.toRadians(-45.0),
                    roll: 0.0
                }
            });
            console.log(filterPoints.length, filterLines.length, pointList.length, lineList.length)
            let points = filterPoints.filter((item) => {
                return item.latitude && item.longitude;
            });
            points.map((item) => {
                mapData.allPoints.push(item.id);
                let obj = {
                    id: item.id,
                    mold: "1",
                    name: item.code,
                    pipelineCode: item.code,
                    type: item.uses,
                    pointX: item.latitude,
                    pointY: item.longitude,
                    attachment: item.attachment,
                    bury: item.bury,
                    red: "0",
                    green: "0",
                    blue: "255",
                    opacity: 1,
                };
                drawPointByAttachment(viewer, obj);
            });
            let lines = filterLines.filter((item) => {
                mapData.allLines.push(item.id);
                return (
                    item.id &&
                    item.endBury &&
                    item.endHigh &&
                    item.startBury &&
                    item.startHigh &&
                    item.startPointLatitude &&
                    item.startPointLongitude &&
                    item.endPointLatitude &&
                    item.endPointLongitude
                );
            });
            lines.map((item) => {
                if (item.id) {
                    let obj = {
                        name: item.code,
                        id: item.id,
                        pipelineCode: item.code,
                        type: item.uses,
                        mold: "2",
                        flowDirection: item.flowDirection,
                        startX: item.startPointLatitude,
                        startY: item.startPointLongitude,
                        startBury: item.startBury,
                        endBury: item.endBury,
                        pipeDiameter: item.pipeDiameter,
                        endX: item.endPointLatitude,
                        endY: item.endPointLongitude,
                        red: "0",
                        green: "255",
                        blue: "255",
                        opacity: 1,
                    };
                    drawLine(viewer, obj);
                }
            });
        }
        // 管点
        const drawPointByAttachment = (viewer, obj) => {
            switch (obj.attachment) {
                case "1":
                    drawCylinder(viewer, obj);
                    break;
                case "2":
                    drawBox(viewer, obj);
                    break;
                default:
                    break;
            }
        }
        //  绘制圆柱
        const drawCylinder = (viewer, obj) => {
            let buryHeight = Math.abs(Number(obj["bury"]));
            viewer.entities.add({
                id: obj["id"],
                name: obj["name"],
                mold: obj["mold"],
                pointtype: obj["type"],//uses
                position: Cesium.Cartesian3.fromDegrees(
                    Number(obj["pointY"]),
                    Number(obj["pointX"]),
                    Number(obj["bury"]) / 2
                ),
                point: {
                    pixelSize: 3,
                    color:
                        obj.type === "3"
                            ? new Cesium.Color.fromCssColorString("#ffff00")
                            : obj.type === "1"
                                ? new Cesium.Color.fromCssColorString("#ff0000")
                                : new Cesium.Color.fromCssColorString("#0000ff"),
                },
                cylinder: {
                    length: buryHeight,
                    topRadius: 1,
                    bottomRadius: 1.5,
                    material:
                        obj.type === "3"
                            ? new Cesium.Color.fromCssColorString("#ffff00")
                            : obj.type === "1"
                                ? new Cesium.Color.fromCssColorString("#ff0000")
                                : new Cesium.Color.fromCssColorString("#0000ff"),
                    outline: false,//外部轮廓线
                    outlineColor: new Cesium.Color(
                        Number(obj.red) / 255,
                        Number(obj.green) / 255,
                        Number(obj.blue) / 255,
                        Number(obj.opacity)
                    ), // 	139,0,139
                },
            });
        }
        // 绘制矩形
        const drawBox = (viewer, obj) => {
            let buryHeight = Math.abs(Number(obj["bury"]));
            viewer.entities.add({
                id: obj["id"],
                properties: {
                    type: obj["pipelineType"],
                },
                mold: obj["mold"],
                name: obj["name"],
                length: buryHeight,
                pointtype: obj["type"],
                position: Cesium.Cartesian3.fromDegrees(
                    Number(obj["pointY"]),
                    Number(obj["pointX"]),
                    Number(obj["bury"]) / 2
                ),
                point: {
                    pixelSize: 3,
                    color:
                        obj.type === "3"
                            ? new Cesium.Color.fromCssColorString("#FFFAF0")
                            : obj.type === "1"
                                ? new Cesium.Color.fromCssColorString("#ff0000")
                                : new Cesium.Color.fromCssColorString("#778899"),
                },
                box: {
                    dimensions: new Cesium.Cartesian3(2, 3, Number(obj["bury"])),
                    material:
                        obj.type === "3"
                            ? new Cesium.Color.fromCssColorString("#FFFAF0")
                            : obj.type === "1"
                                ? new Cesium.Color.fromCssColorString("#ff0000")
                                : new Cesium.Color.fromCssColorString("#778899"),
                },
            });
        }
        // 绘制线条
        const drawLine = (viewer, obj) => {
            let positions = [];
            for (let i = 0; i < 360; i += 6) {
                let radians = Cesium.Math.toRadians(i);
                positions.push(
                    new Cesium.Cartesian2(
                        (Number(obj.pipeDiameter) / 2000) * Math.cos(radians),
                        (Number(obj.pipeDiameter) / 2000) * Math.sin(radians)
                    )
                );
            }
            drawLineShow(viewer, obj, positions);
        }
        //绘制线条
        const drawLineShow = (viewer, obj, positions) => {
            viewer.entities.add({
                id: obj.id,
                name: obj.name,
                mold: obj.mold,
                // properties: {
                //   type: obj["type"],
                // },
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                        Number(obj["startY"]),
                        Number(obj["startX"]),
                        Number(obj["startBury"]) - Number(obj["pipeDiameter"]) / 2000,
                        Number(obj["endY"]),
                        Number(obj["endX"]),
                        Number(obj["endBury"]) - Number(obj["pipeDiameter"]) / 2000,
                    ]),
                    width: Number(obj["pipeDiameter"]) / 200,
                    material:
                        obj.type === "3"
                            ? new Cesium.Color.fromCssColorString("#FFFAF0")
                            : obj.type === "1"
                                ? new Cesium.Color.fromCssColorString("#ff0000")
                                : new Cesium.Color.fromCssColorString("#778899"),
                },
                polylineVolume: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                        // fromDegreesArrayHeights // fromDegreesArray
                        Number(obj["startY"]),
                        Number(obj["startX"]),
                        Number(obj["startBury"]) - Number(obj["pipeDiameter"]) / 1000,
                        Number(obj["endY"]),
                        Number(obj["endX"]),
                        Number(obj["endBury"]) - Number(obj["pipeDiameter"]) / 1000,
                    ]),
                    shape: positions,
                    material:
                        obj.type === "3"
                            ? new Cesium.Color.fromCssColorString("#FFFAF0")
                            : obj.type === "1"
                                ? new Cesium.Color.fromCssColorString("#ff0000")
                                : new Cesium.Color.fromCssColorString("#778899"),
                },
            });
        }
        const lineShowOrHide = (show) => {
            mapData.allLines.forEach((item) => {
                var entity = viewer.entities.getById(item);
                if (entity) {
                    if (show) {
                        entity.show = true;
                    } else {
                        entity.show = false;
                    }
                }
            })
        }
        const pointShowOrHide = (show) => {
            mapData.allPoints.forEach((item) => {
                var entity = viewer.entities.getById(item);
                if (entity) {
                    if (show) {
                        entity.show = true;
                    } else {
                        entity.show = false;
                    }
                }
            })
        }
        // 截图
        const takeScreenshot = () => {
            const removeCallback = viewer.scene.postRender.addEventListener(() => {
                removeCallback();
                try {
                    const cesiumCanvas = viewer.scene.canvas;
                    const canvas = cesiumCanvas;
                    const screenshot = canvas.toDataURL("image/png")
                    const link = document.createElement("a");
                    document.body.appendChild(link);
                    link.download = "screenshot.png";
                    link.href = screenshot;
                    link.click();
                    document.body.removeChild(link);
                }
                catch (e) {
                    console.log(e)
                }
            });
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
            markerArr,
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
            dialogVisible,
            load3DTileset,
            loadPipenet,
            lineShowOrHide,
            pointShowOrHide,
            takeScreenshot,
            reset
        }
    }
}
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