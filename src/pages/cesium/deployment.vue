<template>
    <div :class="['menubox box1', showPanel1 ? '' : 'hide']">
        <div class="menuclose" @click="handleShowPanel(1)">
            <el-icon size="20">
                <Close />
            </el-icon>
        </div>
        <el-radio-group class="demo-tabs" v-model="activeName" @change="handleTabChange">
            <el-radio-button label="矩阵" value="rect" />
            <el-radio-button label="圆形" value="circle" />
            <el-radio-button label="楔形" value="wedge" />
        </el-radio-group>
        <div class="menucell">
            <el-button :icon="Flag" size="small" @click="deploy" type="primary">锚点</el-button>
            <el-button :icon="Place" size="small" @click="reset" type="success">定位</el-button>
            <el-button :icon="Brush" size="small" @click="removeAll" type="danger">清除</el-button>
            <div v-if="activeName == 'rect'" class="flex form-cell">
                <div class="form-cell-label">队列方向：</div>
                <div class="form-cell-content">
                    <el-switch v-model="isVertical" @change="handleVerticalChange" :active-value="true"
                        :inactive-value="false" inline-prompt active-text="纵向队列" inactive-text="横向队列" />
                </div>
            </div>
            <div class="flex form-cell">
                <div class="form-cell-label">队列展开：</div>
                <div class="form-cell-content">
                    <el-switch v-model="shrink" @change="handleShrinkChange" :active-value="true"
                        :inactive-value="false" inline-prompt active-text="队列收缩" inactive-text="队列展开" />
                </div>
            </div>
            <div class="flex form-cell">
                <div class="form-cell-label">人数：</div>
                <div class="form-cell-content">
                    <el-input-number :min="4" :max="1000" v-model="totalNumber" :step="1"
                        @change="handleNumberChange"></el-input-number>
                </div>
            </div>

            <div class="flex form-cell">
                <div class="form-cell-label">层数：</div>
                <div class="form-cell-content">
                    <el-input-number :min="1" :max="1000" v-model="layerNumber" :step="1"
                        @change="handleLayerChange"></el-input-number>
                </div>
            </div>
            <div v-if="activeName !== 'circle'" class="flex form-cell">
                <div class="form-cell-label">方向角度：</div>
                <div class="form-cell-content">
                    <el-slider v-model="bearing" :min="0" :max="360" @change="handlebearingChange" />
                </div>
            </div>
            <div v-if="activeName === 'wedge'" class="flex form-cell">
                <div class="form-cell-label">开口角度：</div>
                <div class="form-cell-content">
                    <el-slider v-model="angle" :min="0" :max="180" @change="handleAngleChange" />
                </div>
            </div>
            <div class="flex form-cell">
                <div class="form-cell-label">转换时间：</div>
                <div class="form-cell-content">
                    <el-input-number v-model="animationTime" :min="0" :max="30" :setp="0.1" />
                </div>
            </div>
            <div class="flex form-cell">
                <div class="form-cell-label">时间倍速：</div>
                <div class="form-cell-content">
                    <el-input-number v-model="multiplier" :min="0" @change="startAnimate(startTime, endTime)" />
                </div>
            </div>
        </div>
        <div v-if="!showPanel1" class="hideicon" @click="handleShowPanel(1)">
            <el-icon size="30">
                <Operation />
            </el-icon>
        </div>
    </div>
    <div :class="['menubox box2', showPanel2 ? '' : 'hide']">
        <div class="menuclose" @click="handleShowPanel(2)">
            <el-icon size="20">
                <Close />
            </el-icon>
        </div>
        <div class="el-tabs">
            <div class="modelList" dropzone="copy">
                <div class="model" draggable="true" v-for="model in modelList" @mousedown="selectModel(model)"
                    @dragend="dragEnd" @dragstart="dragstart" @dragover="dragover">
                    <img class="icon" width="120px" height="80px" :src="model.icon" alt="">
                    <div class="name">{{ model.name }}</div>
                </div>
            </div>
        </div>
        <div class="menucell">
        </div>
        <div v-if="!showPanel2" class="hideicon" @click="handleShowPanel(2)">
            <el-icon size="30">
                <Grid />
            </el-icon>
        </div>
    </div>
    <Map @loaded="handleMapLoaded" class="dropzone" :lazy="false" :duration="0" map-type="grid"></Map>
    <status-bar v-if="loaded" :viewer="viewer"></status-bar>
</template>

<script setup lang="ts">
import * as turf from "@turf/turf";
import { nextTick, onMounted, ref } from "vue";
import * as Cesium from "cesium";
import Map from '@/components/cesium/map.vue'
import statusBar from '@/components/cesium/status-bar.vue'
import 'cesium/Source/Widgets/widgets.css';
import { Place, Brush, Flag, Operation, Grid, Close } from '@element-plus/icons-vue'
import { getCirclePosition, getRectPosition, getWedgePosition, throttle, debounce } from './tool'
import { ElMessage } from "element-plus";
import { ControlEntity, callbackParams } from '@/modules/editor-control/editor-translate'
import { objectControl } from '@/modules/editor-control/control-model'
import Transforms from '@/modules/editor-control/Transforms'
var viewer: Cesium.Viewer;
const activeName = ref('rect');
const target = ref({
    longitude: 116.391257,
    latitude: 39.907204,
    height: 0,
});
const modelList = [
    // {
    //     name: '警车（问题模型）',
    //     url: './models/警车.glb',
    //     icon: ''
    // },
    {
        name: '士兵',
        url: './models/士兵.glb',
        icon: '/models/士兵.png'
    },
    {
        name: '猛士车',
        url: './models/猛士车.glb',
        icon: '/models/猛士车.png'
    },
    {
        name: '水炮车',
        url: './models/水炮车.glb',
        icon: './models/水炮车.png'
    },
    // {
    //     name: '特警车（问题模型）',
    //     url: './models/特警用车.glb'
    // },
    {
        name: '武警巡逻车',
        url: './models/武警巡逻车.glb',
        icon: './models/武警巡逻车.png'
    },
    // {
    //     name: '装甲车（问题模型）',
    //     url: './models/装甲车.glb'
    // },

]
let startTime = Cesium.JulianDate.addHours(Cesium.JulianDate.now(), 8, new Cesium.JulianDate());
let endTime = Cesium.JulianDate.addSeconds(startTime, 3600, new Cesium.JulianDate())
const shrink = ref(false);
const spacing = ref(1.5)
const loaded = ref(false);
const totalNumber = ref(4);
const layerNumber = ref(1);
const bearing = ref(0);
const angle = ref(60);
const animationTime = ref(5)
const multiplier = ref(1.0)
const isVertical = ref(true)
const entitiyList = ref<Cesium.Entity[]>([]);
const targetEntity = ref<Cesium.Entity>();

const showPanel1 = ref(true)
const showPanel2 = ref(true)
const currentUrl = ref('')
const drawModel = ref(false)
const selectModel = (model: any) => {
    currentUrl.value = model.url;
}
const dragstart = (event) => {
    drawModel.value = true
    event.dataTransfer.setData('drag_text', event.target.innerHTML)
}
const dragover = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy';
}
const dragEnd = (event) => {
    console.log(event.x, event.y, "X")
    console.log(event.clientX, event.clientY, "client")
    console.log(event.pageX, event.pageY, "page")
    console.log(event.screenX, event.screenY, "screen")
    console.log(event.offsetX, event.offsetY, "offset")
    console.log(event.layerX, event.layerY, "layer")
    if (drawModel.value) {
        let ray = viewer.camera.getPickRay(new Cesium.Cartesian2(event.x, event.y - 60));
        if (ray) {
            let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            // 如果你想要的是Cesium的长度坐标（Cartesian3），可以直接使用转换后的世界坐标
            if (cartesian) {
                dragAddModel(cartesian)
            }
        }
    }
    drawModel.value = false
}
const handleShowPanel = (index: number) => {
    switch (index) {
        case 1:
            showPanel1.value = !showPanel1.value;
            break;
        case 2:
            showPanel2.value = !showPanel2.value;
            break;
    }
}

const handleNumberChange = () => {
    startAnimate(startTime, endTime)
    nextTick(() => {
        switch (activeName.value) {
            case "rect":
                addRect();
                break;
            case "circle":
                addCircle()
                break;
            case "wedge":
                addWedge()
                break;
        }
    })
}
const handleLayerChange = throttle(() => {
    handleNumberChange()
}, 1000)
const handlebearingChange = throttle(() => {
    console.log("方向角", bearing.value)
    // 重新计算角度
    handleNumberChange()
}, 1000)
const handleAngleChange = throttle(() => {
    console.log("开口角度", angle.value)
    if (angle.value < 30) {
        ElMessage.warning("请勿选择小于30度的开口角度")
        angle.value = 30
    } else {
        handleNumberChange()
    }
}, 1000)

const handleVerticalChange = () => {
    console.log(isVertical.value)
    handleTabChange()
}
const addCircle = () => {
    let coordinates = getCirclePosition(target.value, spacing.value, totalNumber.value, layerNumber.value, bearing.value)
    for (let i = 0; i < totalNumber.value; i++) {
        const position = Cesium.Cartesian3.fromDegrees(coordinates[i][0], coordinates[i][1]);
        var point1 = turf.point([target.value.longitude, target.value.latitude]);
        var point2 = turf.point([coordinates[i][0], coordinates[i][1]]);
        const heading = turf.bearing(point1, point2);
        handleAddModel("model_" + i, position, heading + 90)
    }
}
const addRect = () => {
    const coordinates = getRectPosition(target.value, layerNumber.value, totalNumber.value, spacing.value, bearing.value, isVertical.value)
    for (let i = 0; i < totalNumber.value; i++) {
        const position = Cesium.Cartesian3.fromDegrees(coordinates[i][0], coordinates[i][1]);
        handleAddModel("model_" + i, position, isVertical.value ? 0 : 270)
    }
}
const addWedge = () => {
    const coordinates = getWedgePosition(target.value, angle.value, layerNumber.value, totalNumber.value, spacing.value, bearing.value)
    for (let i = 0; i < coordinates.length; i++) {
        const position = Cesium.Cartesian3.fromDegrees(coordinates[i][0], coordinates[i][1]);
        handleAddModel("model_" + i, position, -90)
    }
}
const handleAddModel = (id: string, position: Cesium.Cartesian3, heading: number) => {
    var property = new Cesium.SampledPositionProperty();
    property.addSample(startTime, position);
    property.addSample(endTime, position);
    let orientationProperty = new Cesium.ConstantProperty(
        Cesium.Transforms.headingPitchRollQuaternion(
            position,
            Cesium.HeadingPitchRoll.fromDegrees(heading, 0, 0)
        )
    )
    let entity = viewer.entities.getById(id);
    if (entity) {
        entity.position = property;
        entity.orientation = orientationProperty;
    } else {
        let model = viewer.entities.add({
            id: id,
            position: property,
            orientation: Cesium.Transforms.headingPitchRollQuaternion(
                position,
                Cesium.HeadingPitchRoll.fromDegrees(heading, 0, 0)
            ),
            model: {
                uri: '/models/Cesium_Man.glb',
            },
        })
        entitiyList.value.push(model)
    }
}
const deploy = () => {
    targetEntity.value = viewer.entities.add({
        name: "锚点",
        position: Cesium.Cartesian3.fromDegrees(target.value.longitude, target.value.latitude, target.value.height),
        label: {
            text: '锚点',
            font: '14pt sans-serif',
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(-15, -20),
        },
        point: {
            // 点的大小（像素）
            pixelSize: 10,
            color: Cesium.Color.RED,
            // 边框颜色
            outlineColor: Cesium.Color.fromCssColorString("yellow"),
            // 边框宽度(像素)
            outlineWidth: 2,
        }
    })
}

const handleTabChange = () => {
    viewer.clock.shouldAnimate = false;

    if (entitiyList.value.length > 0) {
        let getFun = {
            circle: getCirclePosition(target.value, spacing.value, totalNumber.value, layerNumber.value, bearing.value),
            rect: getRectPosition(target.value, layerNumber.value, totalNumber.value, spacing.value, bearing.value, isVertical.value),
            wedge: getWedgePosition(target.value, angle.value, layerNumber.value, totalNumber.value, spacing.value, bearing.value)
        }
        let getHeading = {
            circle: ((coordinate) => {
                var point1 = turf.point([target.value.longitude, target.value.latitude]);
                var point2 = turf.point([coordinate[0], coordinate[1]]);
                const head = turf.bearing(point1, point2);
                return head + 90
            }),
            rect: (() => {
                return isVertical.value ? 0 : 270
            }),
            wedge: (() => {
                return -90
            }),
        }
        let coordinates: any[] = getFun[activeName.value]
        let entityArr = entitiyList.value
        entityArr.forEach((entity, index) => {
            entity.availability = new Cesium.TimeIntervalCollection([
                new Cesium.TimeInterval({
                    start: startTime,
                    stop: endTime,
                }),
            ])
            // 判断 position 是否为 类型
            let stp = entity.position.getValue(viewer.clock.currentTime)
            if (stp) {
                let positionProperty = movePosition(stp, coordinates[index], startTime.clone(), endTime.clone());
                entity.position = positionProperty;
                entity.orientation = new Cesium.VelocityOrientationProperty(positionProperty)
            }
            let heading: number = getHeading[activeName.value](coordinates[index])
            setTimeout(() => {
                entity.orientation = new Cesium.ConstantProperty(
                    Cesium.Transforms.headingPitchRollQuaternion(
                        entity.position.getValue(viewer.clock.currentTime),
                        Cesium.HeadingPitchRoll.fromDegrees(heading, 0, 0)
                    )
                )
            }, 5200);
        })
        startAnimate(startTime, endTime)
    }

}
const movePosition = (startPosition: Cesium.Cartesian3, coordinate: Cesium.Cartesian3, startTime: Cesium.JulianDate, endTime: Cesium.JulianDate) => {
    var property = new Cesium.SampledPositionProperty();
    let endPosition = Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1]);
    let stopTime = Cesium.JulianDate.addSeconds(startTime, animationTime.value, new Cesium.JulianDate());
    property.addSample(startTime.clone(), startPosition);
    property.addSample(stopTime.clone(), endPosition);
    // if(property.removeSample(endTime.clone())){
    //     console.log('removeSample')
    // }
    property.addSample(endTime.clone(), endPosition);
    return property;
}

const moveOrientation = (coordinate: Cesium.Cartesian3, endTime: Cesium.JulianDate) => {
    var property = new Cesium.SampledProperty(Cesium.EllipsoidSurfaceAppearance);
    let endPosition = Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1]);
    var point1 = turf.point([target.value.longitude, target.value.latitude]);
    var point2 = turf.point([coordinate[0], coordinate[1]]);
    const heading = turf.bearing(point1, point2);
    let hpr = Cesium.HeadingPitchRoll.fromDegrees(heading, 0, 0)
    let last = Cesium.JulianDate.addSeconds(endTime.clone(), 1, new Cesium.JulianDate())
    property.addSample(last, Cesium.Transforms.headingPitchRollQuaternion(endPosition, hpr));
    return property;
}

const startAnimate = (startTime: Cesium.JulianDate, endTime: Cesium.JulianDate) => {
    // viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
    viewer.clock.startTime = startTime.clone();
    viewer.clock.stopTime = endTime.clone();
    // viewer.clock.stopTime = Cesium.JulianDate.addSeconds(endTime.clone(), 3, new Cesium.JulianDate());
    // viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
    viewer.clock.currentTime = startTime.clone();
    viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
    viewer.clock.multiplier = multiplier.value;
    viewer.clock.shouldAnimate = true;
}
const control = ref<ControlEntity>()
const selectId = ref<string>()
const handleMapLoaded = (cviewer: Cesium.Viewer) => {
    viewer = cviewer;
    loaded.value = true
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (event) {
        let ray = viewer.camera.getPickRay(event.position);
        if (!ray) return
        let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
        let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
        let coordinate = {
            longitude: Number(lng.toFixed(6)),
            latitude: Number(lat.toFixed(6)),
            height: Number(0),
        };
        target.value = coordinate;
        if (targetEntity.value) {
            let targetPosition = Cesium.Cartesian3.fromDegrees(coordinate.longitude, coordinate.latitude, coordinate.height)
            targetEntity.value.position = new Cesium.ConstantPositionProperty(targetPosition);
        }
        var pick = viewer.scene.pick(event.position);//拾取鼠标所在的entity
        if (Cesium.defined(pick)) {
            if (pick.id.id === selectId.value) {
                let entity = viewer.entities.getById(selectId.value)
                if (entity) {
                    entity.model.color = new Cesium.ConstantProperty(Cesium.Color.WHITE);
                    // entity.model.colorBlendMode = Cesium.ColorBlendMode.HIGHLIGHT;
                }

                selectId.value = '';
                if (control.value) {
                    control.value.destroy()
                }
                return
            }
            if (pick.id.name === '模型') {
                let entity: Cesium.Entity = pick.id
                let sid = pick.id.id
                selectId.value = sid
                let position = entity?.position?.getValue(viewer.clock.currentTime)
                let orientation = entity?.orientation.getValue(viewer.clock.currentTime);
                // 四元数计算三维旋转矩阵
                let mtx3 = Cesium.Matrix3.fromQuaternion(orientation, new Cesium.Matrix3());

                // 四维转换矩阵
                let mtx4 = Cesium.Matrix4.fromRotationTranslation(mtx3, position, new Cesium.Matrix4());

                // 计算HeadingPitchRoll，结果为弧度
                let hpr = Cesium.Transforms.fixedFrameToHeadingPitchRoll(
                    mtx4,
                    Cesium.Ellipsoid.WGS84,
                    Cesium.Transforms.eastNorthUpToFixedFrame,
                    new Cesium.HeadingPitchRoll(),
                );

                console.log("orientation", orientation)
                let positionsCallback = (callbackParams: callbackParams) => {
                    if (entity) {
                        entity!.position = new Cesium.ConstantPositionProperty(
                            callbackParams.newPosition
                        )
                        if (callbackParams.newQuaternion)
                            entity!.orientation = new Cesium.ConstantProperty(callbackParams.newQuaternion)
                        if (callbackParams.newScale) {
                            entity!.model.scale = new Cesium.ConstantProperty(callbackParams.newScale)
                        }
                    }
                };
                control.value = new ControlEntity(viewer, { id: sid, type: 'translate,roate,scale', position, orientation: hpr, scale: 1 }, positionsCallback)
                // let transform = Cesium.Matrix4.fromTranslationQuaternionRotationScale(position, orientation, new Cesium.Cartesian3(1, 1, 1), new Cesium.Matrix4());//得到entity的位置朝向矩阵
                // let callback = (transformMatrix4: Cesium.Matrix4) => {
                //     console.log(transformMatrix4)// someArray是一个包含16个元素的数组
                //     // 我们要计算的position可以表示为一个三维向量，这里我们用Cesium.Cartesian3
                //     var position = new Cesium.Cartesian3(); // 初始化一个空的Cartesian3对象来存储计算结果
                //     // 使用Cesium的工具函数来从矩阵中提取位置信息
                //     Cesium.Matrix4.getTranslation(transformMatrix4, position);
                //     var orientation = Cesium.Quaternion.fromRotationMatrix(transformMatrix4);
                //     if (entity) {
                //         entity!.position = new Cesium.ConstantPositionProperty(position);
                //         entity!.orientation = new Cesium.ConstantProperty(orientation)
                //     }
                // }
                // new Transforms(viewer, transform, callback)
                pick!.id!.model.color = Cesium.Color.fromCssColorString('#00ff55')
                // pick.id.model.colorBlendMode = Cesium.ColorBlendMode.HIGHLIGHT;
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    document.addEventListener('mouseup', throttle((event) => {
        console.log('鼠标抬起事件触发', event, new Cesium.Cartesian2(event.offsetX, event.offsetY));
        // 你可以在这里添加其他的逻辑处理
        if (drawModel.value) {
            let ray = viewer.camera.getPickRay(new Cesium.Cartesian2(event.offsetX, event.offsetY));
            if (ray) {
                let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                // 如果你想要的是Cesium的长度坐标（Cartesian3），可以直接使用转换后的世界坐标
                if (cartesian) {
                    dragAddModel(cartesian)
                }
            }
        }
    }, 300));
}
const dragAddModel = (cartesian) => {
    let model = viewer.entities.add({
        position: new Cesium.ConstantPositionProperty(cartesian),
        orientation: Cesium.Transforms.headingPitchRollQuaternion(
            cartesian,
            Cesium.HeadingPitchRoll.fromDegrees(0, 0, 0)
        ),
        name: '模型',
        model: {
            uri: currentUrl.value,
        },
    })
    viewer.zoomTo(model).then((res) => {
        console.log('zoomto', res)
    })
}
const reset = () => {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.391257, 39.907204, 30),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0,
        },
        duration: 1
    });
}
const removeAll = () => {
    entitiyList.value = []
    viewer.entities.removeAll()
    sessionStorage.removeItem('markers')
}
const handleShrinkChange = (shrink: boolean) => {
    if (shrink) {
        spacing.value = 0.8
    } else {
        spacing.value = 1.5
    }
    handleNumberChange()
}
onMounted(() => {
    entitiyList.value = []
})
</script>

<style lang="scss" scoped>
.menubox {
    position: absolute;
    z-index: 999;
    border-bottom-right-radius: 10px;
    padding: 0 10px 10px;
    border: 1px solid rgba(139, 139, 139, 0.2);
    background-color: #222222;
    user-select: none;
    transition: all .3s;

    .menuclose {
        position: absolute;
        right: 4px;
        top: 4px;
        cursor: pointer;
        color: #00eeff;

        &:hover {
            color: #ffffff
        }
    }

    &.hide {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        padding: 0;
        background-color: #01a1fd;
        // border: 1px solid #00eeff;
        transition: all .3s;

        &:hover {
            box-shadow: 0 0 4px 1px #00eeff;
        }

        .el-tabs {
            display: none;
        }

        .menucell {
            display: none;
        }

        .menuclose {
            display: none;
        }

        .demo-tabs {
            display: none;
        }
    }

    &.box1 {
        left: 5px;
        top: 65px;
    }

    &.box2 {
        left: 5px;
        bottom: 65px;
    }

    .hideicon {
        width: 30px;
        height: 30px;
        padding: 5px;
        transition: all .3s;
    }

    .demo-tabs {
        margin: 10px auto;
    }

    .modelList {
        width: 130px;
        display: flex;
        flex-wrap: wrap;
        overflow-y: auto;
        height: 300px;
        margin-top: 30px;
        .model {
            width: 100px;
            height: 100px;
            border: 1px solid #00eeff33;
            margin: 10px;

            &:active {
                cursor: grab;
            }

            .icon {
                width: 80px;
                height: 60px;
                padding: 5px;
                transition: all .3s;
            }

            .name {
                // height: 40px;
                // line-height: 32px;
                text-align: center;
            }

            &:hover {
                background-color: #00eeff33;
                border: 1px solid #00eeff;


                .icon {
                    width: 100px;
                    height: 80px;
                    padding: 0px;
                    transition: all .3s;
                }
            }
        }
    }

    .tab-body {
        width: 250px;

        .text {
            line-height: 24px;
            text-indent: 24px;
            text-align: start;
        }
    }
}

.form-cell {
    line-height: 32px;
    margin: 5px 0;

    .form-cell-label {
        line-height: 32px;
        width: 72px;
        text-align: end;
    }

    .form-cell-content {
        width: calc(100% - 72px);
    }
}
</style>