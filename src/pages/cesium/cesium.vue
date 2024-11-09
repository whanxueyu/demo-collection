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
                    <el-radio-group class="demo-tabs" v-model="showMark">
                        <el-radio-button label="关闭" value="" />
                        <el-radio-button label="标记" value="billboard" />
                        <el-radio-button label="div" value="div" />
                        <el-radio-button label="gif" value="gif" />
                    </el-radio-group>
                    <el-button type="primary" v-if="showMark === 'billboard'" @click="saveAll">保存标记</el-button>
                    <div class="row">
                        <el-radio-group v-model="mapData.markIcon" v-if="showMark === 'billboard'">
                            <el-radio :label="1">
                                <div class="align-center flex">
                                    <span>Mark</span>
                                    <el-image style="width: 24px; height: 24px" :src="marker" fit="fill" />
                                </div>
                            </el-radio>
                            <el-radio :label="2">
                                <div class="align-center flex">
                                    <span>Pin</span>
                                    <el-image style="width: 24px; height: 24px" :src="pin" fit="fill" />
                                </div>
                            </el-radio>
                            <el-radio :label="3">
                                <div class="align-center flex">
                                    <span>Flag</span>
                                    <el-image style="width: 24px; height: 24px" :src="flag" fit="fill" />
                                </div>
                            </el-radio>
                            <el-radio :label="4">
                                <div class="align-center flex">
                                    <span>Star</span>
                                    <el-image style="width: 24px; height: 24px" :src="star" fit="fill" />
                                </div>
                            </el-radio>
                        </el-radio-group>
                        <el-radio-group v-model="mapData.markIcon" v-if="showMark === 'div'">
                            <el-radio :label="5">
                                <div class="align-center flex">
                                    <span>基础</span>
                                </div>
                            </el-radio>
                            <el-radio :label="6">
                                <div class="align-center flex">
                                    <span>边框</span>
                                </div>
                            </el-radio>
                            <el-radio :label="7">
                                <div class="align-center flex">
                                    <span>边线</span>
                                </div>
                            </el-radio>
                        </el-radio-group>
                        <el-radio-group v-model="mapData.markIcon" v-if="showMark === 'gif'">
                            <el-radio :label="1">
                                <div class="align-center flex">
                                    <span>shine</span>
                                    <el-image style="width: 24px; height: 24px" :src="shine" fit="fill" />
                                </div>
                            </el-radio>
                            <el-radio :label="2">
                                <div class="align-center flex">
                                    <span>blue</span>
                                    <el-image style="width: 24px; height: 24px" :src="blue" fit="fill" />
                                </div>
                            </el-radio>
                            <el-radio :label="3">
                                <div class="align-center flex">
                                    <span>pop</span>
                                    <el-image style="width: 24px; height: 24px" :src="pop" fit="fill" />
                                </div>
                            </el-radio>
                            <el-radio :label="4">
                                <div class="align-center flex">
                                    <span>radar</span>
                                    <el-image style="width: 24px; height: 24px" :src="radar" fit="fill" />
                                </div>
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
                    <div class="flex align-center justify-between">
                        <div>
                            <el-button type="success" @click="loadPipenet">管网生成</el-button>
                        </div>
                        <div>
                            <div>
                                <span>管线：</span><el-switch v-model="showLine" inline-prompt active-text="显示"
                                    inactive-text="隐藏" @change="lineShowOrHide"></el-switch>
                            </div>
                            <div>
                                <span>管点：</span><el-switch v-model="showPoint" inline-prompt active-text="显示"
                                    inactive-text="隐藏" @change="pointShowOrHide"></el-switch>
                            </div>
                        </div>
                    </div>
                    <div>
                        <el-button type="danger" plain size="small" @click="lineClear"><el-icon class="el-icon--right">
                                <Delete />
                            </el-icon> 清除管线</el-button>
                        <el-button type="danger" plain size="small" @click="pointClear"><el-icon class="el-icon--right">
                                <Delete />
                            </el-icon> 清除管点</el-button>
                    </div>
                    <el-divider content-position="left"></el-divider>
                    <div class="colorSection">
                        <div class="sectiontitle">
                            <h3>修改管网颜色材质</h3>
                            <el-button type="primary" plain size="small" @click="changeMaterial">修改</el-button>
                        </div>
                        <el-row>
                            <el-col :span="6" style="line-height: 32px;">椎体：</el-col>
                            <el-col :span="6">
                                <span>1：</span>
                                <el-color-picker v-model="colorOption.cylinder1" />
                            </el-col>
                            <el-col :span="6">
                                <span>2：</span>
                                <el-color-picker v-model="colorOption.cylinder2" />
                            </el-col>
                            <el-col :span="6">
                                <span>3：</span>
                                <el-color-picker v-model="colorOption.cylinder3" />
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6" style="line-height: 32px;">立方体：</el-col>
                            <el-col :span="6">
                                <span>1：</span>
                                <el-color-picker v-model="colorOption.box1" />
                            </el-col>
                            <el-col :span="6">
                                <span>2：</span>
                                <el-color-picker v-model="colorOption.box2" />
                            </el-col>
                            <el-col :span="6">
                                <span>3：</span>
                                <el-color-picker v-model="colorOption.box3" />
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6" style="line-height: 32px;">管道：</el-col>
                            <el-col :span="6">
                                <span>1：</span>
                                <el-color-picker v-model="colorOption.line1" />
                            </el-col>
                            <el-col :span="6">
                                <span>2：</span>
                                <el-color-picker v-model="colorOption.line2" />
                            </el-col>
                            <el-col :span="6">
                                <span>3：</span>
                                <el-color-picker v-model="colorOption.line3" />
                            </el-col>
                        </el-row>
                    </div>
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
    <imageryEditer :viewer="viewer" v-if="mapLoaded"></imageryEditer>
    <div class="addition">
        <div class="align-center flex">
            <div :class="activeTool === 'screenShot' ? 'menuBtn active' : 'menuBtn'" @click="takeScreenshot">
                <el-tooltip class="box-item" effect="dark" content="保存图片" placement="top">
                    <el-icon>
                        <Picture />
                    </el-icon>
                </el-tooltip>
            </div>
            <div :class="activeTool === 'drawLine' ? 'menuBtn active' : 'menuBtn'" @click="handleDrawLine">
                <el-tooltip class="box-item" effect="dark" content="画线" placement="top">
                    <el-icon>
                        <EditPen />
                    </el-icon>
                </el-tooltip>
            </div>
            <div :class="activeTool === 'measure' ? 'menuBtn active' : 'menuBtn'" @click="handleMeasurement">
                <el-tooltip class="box-item" effect="dark" content="测量" placement="top">
                    <el-icon>
                        <Share />
                    </el-icon>
                </el-tooltip>
            </div>
        </div>
    </div>
    <Map @loaded="handleMapLoaded"></Map>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import * as Cesium from "cesium";
import Map from '@/components/cesium/map.vue'
import 'cesium/Source/Widgets/widgets.css';
import { useNow, useDateFormat } from '@vueuse/core'
import { pointList, lineList, filterPoints, filterLines } from '@/static/fakedata/fakedata'
import { LocationInformation, Delete, Refresh, OfficeBuilding, Rank, Picture, EditPen, Share } from '@element-plus/icons-vue'
import { ElMessage } from "element-plus";
import DivBillboard from '@/modules/customBillboard/DivBillboard';
import anallysisDiv from "@/components/billboard/anallysisDiv.vue";
import borderDiv from "@/components/billboard/borderDiv.vue";
import lineDiv from "@/components/billboard/lineDiv.vue";
import imageryEditer from '@/components/cesium/imageryEditer.vue'
import { color } from "echarts";
var viewer;

const mapData = reactive({
    markType: '1',
    markIcon: 0,
    allLines: [],
    allPoints: [],
    tempSketch: [],
    tempCalculate: [],
})
const showMark = ref('')
const showLine = ref(false)
const showPoint = ref(false)
const activeTool = ref('')

const colorOption = reactive({
    box1: '#930000',
    box2: '#004C93',
    box3: '#015F3C',
    cylinder1: '#FF8706',
    cylinder2: '#2E90FF',
    cylinder3: '#9EFC32',
    line1: '#FF2E50',
    line2: '#06DEFF',
    line3: '#2EFF8B',
})
const formatDate = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss')
const markerArr = reactive({
    list: []
})
const marker = require('@/assets/icon/marker.png')
const flag = require('@/assets/icon/flag.png')
const pin = require('@/assets/icon/pin.png')
const star = require('@/assets/icon/star.png')

const shine = require('@/assets/gif/shine.gif')
const blue = require('@/assets/gif/bomb.gif')
const pop = require('@/assets/gif/tf.gif')
const radar = require('@/assets/gif/typhoon.gif')

const mapLoaded = ref(false)
const handleMapLoaded = (cviewer) => {
    viewer = cviewer;
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    // 右
    handler.setInputAction(function (event) {
        // let ray = viewer.camera.getPickRay(event.position);
        // let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        var cartesian = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
        let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
        let coordinate = {
            longitude: Number(lng.toFixed(6)),
            latitude: Number(lat.toFixed(6)),
            height: Number(cartographic.height.toFixed(6)),
        };
        if (showMark.value === 'billboard') {
            addMark(coordinate.longitude, coordinate.latitude)
        }
        if (showMark.value === "div") {
            addDiv(coordinate)
        }
        if (showMark.value === 'gif') {
            loadGif(coordinate.longitude, coordinate.latitude)
        }
        if (activeTool.value === 'drawLine') {
            mapData.tempSketch.push(cartesian);
            drawSketch()
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    mapLoaded.value = true
}
const drawSketch = () => {
    //   let uuid = generateUniqueId()
    var _update = function () {
        return mapData.tempSketch
    };
    viewer.entities.add({
        // id: 'line_' + uuid,
        name: '直线',
        polyline: {
            positions: new Cesium.CallbackProperty(
                _update,
                false
            ),
            material: Cesium.Color.fromCssColorString('#22ff00'),
            width: 2,
        },
        show: true,
    })
}
const drawCalculate = (viewer) => {
    drawLineString(viewer, function (positions) {
        var wgs84_positions = [];
        for (var i = 0; i < positions.length; i += 4) {
            var wgs84_point = Cartesian3_to_WGS84({
                x: positions[i].x,
                y: positions[i].y,
                z: positions[i].z,
            });
            wgs84_positions.push(wgs84_point);
        }
    });
}
// eslint-disable-next-line
const drawLineString = (viewer, callback) => {
    var PolyLinePrimitive = (function () {
        function _(this: any, positions) {
            this.options = {
                polyline: {
                    show: true,
                    positions: [],
                    material: Cesium.Color.RED,
                    width: 3,
                },
            };
            this.positions = positions;
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                return _self.positions;
            };
            //实时更新polyline.positions
            this.options.polyline.positions = new Cesium.CallbackProperty(
                _update,
                false
            );
            viewer.entities.add(this.options);
        };
        return _;
    })();

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    var positions = mapData.tempCalculate;
    var poly = undefined;
    var distance = 0;
    var lastDistance = 0;
    //鼠标左键单击画点
    handler.setInputAction(function (movement) {
        var cartesian = viewer.scene.camera.pickEllipsoid(
            movement.position,
            viewer.scene.globe.ellipsoid
        );
        if (positions.length == 0) {
            positions.push(cartesian.clone());
        } else {
            distance = getSpaceDistance(positions);
        }
        positions.push(cartesian);
        // 在三维场景中添加Label
        let textDisance = (distance - lastDistance).toFixed(2) + "米";
        nextTick(() => {
            lastDistance = distance;
        })
        console.log(textDisance)
        let flag = true;
        if (distance === 0) {
            flag = false;
            return
        }
        if (distance == lastDistance) {
            return false
        }
        viewer.entities.add({
            name: "空间直线距离",
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.NONE,
            },
            label: {
                text: textDisance,
                font: "18px sans-serif",
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -20),
                heightReference: Cesium.HeightReference.NONE,
                show: flag,
            },
            properties: {
                aaa: "11",
            },
            height: 20,
        });
        lastDistance = distance;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //鼠标移动
    handler.setInputAction(function (movement) {
        var cartesian = viewer.scene.camera.pickEllipsoid(
            movement.endPosition,
            viewer.scene.globe.ellipsoid
        );
        if (positions.length >= 2) {
            if (!Cesium.defined(poly)) {
                poly = new PolyLinePrimitive(positions);
            } else {
                if (cartesian != undefined) {
                    positions.pop();
                    cartesian.y += 1 + Math.random();
                    positions.push(cartesian);
                }
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //单击鼠标右键结束画线
    handler.setInputAction(function (movement) {
        var cartesian = viewer.scene.camera.pickEllipsoid(
            movement.position,
            viewer.scene.globe.ellipsoid
        );
        if (positions.length >= 2) {
            if (!Cesium.defined(poly)) {
                poly = new PolyLinePrimitive(positions);
            } else {
                if (cartesian != undefined) {
                    positions.pop();
                    cartesian.y += 1 + Math.random();
                    positions.push(cartesian);
                }
            }
        }
        distance = getSpaceDistance(positions);
        // 在三维场景中添加Label
        let textDisance = (distance - lastDistance).toFixed(2) + "米";
        nextTick(() => {
            lastDistance = distance;
        })
        console.log(textDisance)
        let flag = true;
        if (distance === 0) {
            flag = false;
            return
        }
        if (distance == lastDistance) {
            return false
        }
        viewer.entities.add({
            name: "空间直线距离",
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.NONE,
            },
            label: {
                text: textDisance,
                font: "18px sans-serif",
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -20),
                heightReference: Cesium.HeightReference.NONE,
                show: flag,
            },
            properties: {
                aaa: "11",
            },
            height: 20,
        });
        handler.destroy();
        handler = undefined;
        // positions.pop(); //最后一个点无效
        // callback(positions, movement);
        activeTool.value = ''
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}
// 空间两点距离计算函数
const getSpaceDistance = (positions) => {
    let distance = 0;
    for (let i = 0; i < positions.length - 1; i++) {
        let point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
        let point2cartographic = Cesium.Cartographic.fromCartesian(
            positions[i + 1]
        );
        /** 根据经纬度计算出距离**/
        let geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        let s = geodesic.surfaceDistance;
        // 返回两点之间的距离
        s = Math.sqrt(
            Math.pow(s, 2) +
            Math.pow(point2cartographic.height - point1cartographic.height, 2)
        );
        distance = distance + s;
    }
    return Number(distance.toFixed(2));
}
const Cartesian3_to_WGS84 = (point) => {
    var cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
    var cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var lng = Cesium.Math.toDegrees(cartographic.longitude);
    var alt = cartographic.height;
    return {
        lat: lat,
        lng: lng,
        alt: alt,
    };
}
const reset = () => {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.391257, 39.907204, 30),
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
const addMark = (longitude, latitude) => {
    let icon = ''
    let name = ''
    if (showMark.value) {
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
const addDiv = (coordinate) => {
    let component;
    if (mapData.markIcon === 5) {
        component = anallysisDiv
    } else if (mapData.markIcon === 6) {
        component = borderDiv
    } else if (mapData.markIcon === 7) {
        component = lineDiv
    }
    let pos = Cesium.Cartesian3.fromDegrees(coordinate.longitude, coordinate.latitude, coordinate.height);
    let content = `经度：${coordinate.longitude}\n纬度：${coordinate.latitude}\n高度：${coordinate.height}`
    let billboard = new DivBillboard(viewer, pos, content, component);
    console.log(billboard)
    addpoint(coordinate.longitude, coordinate.latitude)
}
const addpoint = (longitude, latitude) => {
    viewer.entities.add({
        name: name,
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
        point: {
            pixelSize: 2,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.NONE,
        },
    })
}

function loadGif(longitude, latitude) {
    let icon = ''
    let name = ''
    if (showMark.value === 'gif') {
        if (mapData.markIcon === 1) {
            icon = shine
            name = "shine"
        } else if (mapData.markIcon === 2) {
            icon = blue
            name = "blue"
        } else if (mapData.markIcon === 3) {
            icon = pop
            name = "pop"
        } else {
            icon = radar
            name = "radar"
        }
        console.log("gifler", icon)
        let gifler: any = (window as any).gifler
        let gif = gifler(icon)
        let entity = viewer.entities.add({
            name: name,
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
            billboard: {
                scale: 0.5
            }

        })
        // 解析gif每帧图片，按时间序列进行切换
        gif.frames(document.createElement('canvas'), function (ctx, frame) {
            entity.billboard.image = new Cesium.CallbackProperty(() => {
                return frame.buffer.toDataURL()
            }, false)
        })
    }

}
const defaultMark = (longitude, latitude, mark) => {
    let icon = ''
    let name = ''
    if (showMark.value) {
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

// 加载3DTileset
const load3DTileset = async () => {
    try {
        const tileset = await Cesium.Cesium3DTileset.fromUrl(
            "https://zouyaoji.top/vue-cesium/SampleData/Cesium3DTiles/Tilesets/dayanta/tileset.json"
        );
        viewer.scene.primitives.add(tileset);
        var height = 738.0
        tileset.initialTilesLoaded.addEventListener(function () {
            console.log('Initial tiles are loaded');
            var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
            var lng = Cesium.Math.toDegrees(cartographic.longitude) //使用经纬度和弧度的转换，将WGS84弧度坐标系转换到目标值，弧度转度
            var lat = Cesium.Math.toDegrees(cartographic.latitude)
            // var lat = 34.219588
            // var lng = 108.959397
            //计算中心点位置的地表坐标
            var surface = Cesium.Cartesian3.fromRadians(lng, lat, 0.0)
            //偏移后的坐标
            var offset = Cesium.Cartesian3.fromRadians(lng, lat, 0)
            var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
        });
        viewer.zoomTo(tileset);
    } catch (error) {
        console.error(`Error creating tileset: ${error}`);
    }
}
const changeMaterial = () => {
    viewer.entities.removeAll()
    loadPipenet()
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
    if (mapData.allPoints.length > 0) {
        ElMessage.warning("请勿重复生成管网")
        return
    }
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
                    ? Cesium.Color.fromCssColorString(colorOption.cylinder3)
                    : obj.type === "1"
                        ? Cesium.Color.fromCssColorString(colorOption.cylinder1)
                        : Cesium.Color.fromCssColorString(colorOption.cylinder2),
        },
        cylinder: {
            length: buryHeight,
            topRadius: 1,
            bottomRadius: 1.5,
            material:
                obj.type === "3"
                    ? Cesium.Color.fromCssColorString(colorOption.cylinder3)
                    : obj.type === "1"
                        ? Cesium.Color.fromCssColorString(colorOption.cylinder1)
                        : Cesium.Color.fromCssColorString(colorOption.cylinder2),
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
                    ? Cesium.Color.fromCssColorString(colorOption.box3)
                    : obj.type === "1"
                        ? Cesium.Color.fromCssColorString(colorOption.box1)
                        : Cesium.Color.fromCssColorString(colorOption.box2),
        },
        box: {
            dimensions: new Cesium.Cartesian3(2, 3, Number(obj["bury"])),
            material:
                obj.type === "3"
                    ? Cesium.Color.fromCssColorString(colorOption.box3)
                    : obj.type === "1"
                        ? Cesium.Color.fromCssColorString(colorOption.box1)
                        : Cesium.Color.fromCssColorString(colorOption.box2),
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
                    ? Cesium.Color.fromCssColorString(colorOption.line3)
                    : obj.type === "1"
                        ? Cesium.Color.fromCssColorString(colorOption.line1)
                        : Cesium.Color.fromCssColorString(colorOption.line2),
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
                    ? Cesium.Color.fromCssColorString(colorOption.line3)
                    : obj.type === "1"
                        ? Cesium.Color.fromCssColorString(colorOption.line1)
                        : Cesium.Color.fromCssColorString(colorOption.line2),
        },
    });
}
const lineClear = () => {
    mapData.allLines.forEach((item) => {
        var entity = viewer.entities.getById(item);
        if (entity) {
            viewer.entities.removeById(item);
        }
    })
}
const pointClear = () => {
    mapData.allPoints.forEach((item) => {
        var entity = viewer.entities.getById(item);
        if (entity) {
            viewer.entities.removeById(item);
        }
    })
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
            link.download = formatDate.value + "screenshot.png";
            link.href = screenshot;
            link.click();
            document.body.removeChild(link);
        }
        catch (e) {
            console.log(e)
        }
    });
    activeTool.value = 'screenShot'
    setTimeout(() => {
        activeTool.value = ''
    }, 500)
}
const handleDrawLine = () => {
    if (activeTool.value === 'drawLine') {
        activeTool.value = ''
    } else {
        activeTool.value = 'drawLine'
    }
}
const handleMeasurement = () => {
    if (activeTool.value === 'measur') {
        activeTool.value = ''
    } else {
        activeTool.value = 'measur'
        drawCalculate(viewer)
    }
}
onMounted(() => {
    markerArr.list = JSON.parse(sessionStorage.getItem("markers")) || []
    console.log(markerArr.list)
    if (markerArr.list.length > 0) {
        markerArr.list.forEach((item) => {
            defaultMark(item.longitude, item.latitude, item.name)
        })
    }
})
</script>

<style lang="scss" scoped>
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

.row {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
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