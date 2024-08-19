<template>
    <div class="menubox">
        <el-tabs v-model="activeName" @tab-change="handleTabChange" class="demo-tabs">
            <el-tab-pane label="矩阵" name="rect"></el-tab-pane>
            <el-tab-pane label="圆形" name="circle"></el-tab-pane>
            <el-tab-pane label="楔形" name="wedge"></el-tab-pane>
        </el-tabs>
        <div>
            <el-button :icon="Location" @click="deploy" type="primary"></el-button>
            <el-button :icon="Refresh" @click="reset" type="success"></el-button>
            <el-button :icon="Brush" @click="removeAll" type="danger"></el-button>
            <el-checkbox @Change="handleShrinkChange" v-model="shrink" label="是否收缩" :value="true"></el-checkbox>
            <div v-if="activeName == 'rect'" class="flex form-cell">
                <div class="form-cell-label">纵向横向：</div>
                <div class="form-cell-content">
                    <el-switch v-model="isVertical" :active-value="true" :inactive-value="false"
                        @change="handleVerticalChange"></el-switch>
                </div>
            </div>
            <div class="flex form-cell">
                <div class="form-cell-label">人数：</div>
                <div>
                    <el-input-number :min="4" :max="1000" v-model="totalNumber" :step="1"
                        @change="handleNumberChange"></el-input-number>
                </div>
            </div>
            <div class="flex form-cell">
                <div class="form-cell-label">层数：</div>
                <div>
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
        </div>
    </div>
    <Map @loaded="handleMapLoaded" :lazy="false" :duration="0" map-type="grid"></Map>
    <status-bar v-if="loaded" :viewer="viewer"></status-bar>
</template>

<script setup lang="ts">
import * as turf from "@turf/turf";
import { nextTick, onMounted, ref } from "vue";
import * as Cesium from "cesium";
import Map from '@/components/cesium/map.vue'
import statusBar from '@/components/cesium/status-bar.vue'
import 'cesium/Source/Widgets/widgets.css';
import { Refresh, Brush, Location } from '@element-plus/icons-vue'
import { getCirclePosition, getRectPosition, getWedgePosition, throttle, debounce } from './tool'
import { ElMessage } from "element-plus";
var viewer: Cesium.Viewer;
const activeName = ref('rect');
const target = ref({
    longitude: 116.391257,
    latitude: 39.907204,
    height: 0,
});
let startTime = Cesium.JulianDate.addHours(Cesium.JulianDate.now(), 8, new Cesium.JulianDate());
let endTime = Cesium.JulianDate.addSeconds(startTime, 3600, new Cesium.JulianDate())
const shrink = ref(false);
const spacing = ref(1.5)
const loaded = ref(false);
const totalNumber = ref(4);
const layerNumber = ref(1);
const bearing = ref(0);
const angle = ref(60);
const isVertical = ref(true)
const entitiyList = ref<Cesium.Entity[]>([]);
const targetEntity = ref<Cesium.Entity>();
const handleNumberChange = () => {
    entitiyList.value.forEach((entity: Cesium.Entity) => {
        viewer.entities.remove(entity)
    })
    entitiyList.value = []
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
    let orientationProperty = new Cesium.CallbackProperty(() => {
        return Cesium.HeadingPitchRoll.fromDegrees(heading, 0, 0)
    }, true)
    console.log('heading', heading)
    let model = viewer.entities.getById(id);
    if (model) {
        model.position = property;
        model.orientation = orientationProperty;
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
        startAnimate(startTime, endTime)
        let getFun = {
            circle: getCirclePosition(target.value, spacing.value, totalNumber.value, layerNumber.value, bearing.value),
            rect: getRectPosition(target.value, layerNumber.value, totalNumber.value, spacing.value, bearing.value, isVertical.value),
            wedge: getWedgePosition(target.value, angle.value, layerNumber.value, totalNumber.value, spacing.value, bearing.value)
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
                // let orientationProperty = moveOrientation(coordinates[index], endTime.clone())
                entity.position = positionProperty;
                entity.orientation = new Cesium.VelocityOrientationProperty(positionProperty)
                // entity.orientation = new Cesium.CallbackProperty(() => {
                //     return Cesium.HeadingPitchRoll.fromDegrees(0, 0, 0)
                // }, false)
            }
        })
        setTimeout(() => {
            handleNumberChange()
        }, 5200);
    }

}
const movePosition = (startPosition: Cesium.Cartesian3, coordinate: Cesium.Cartesian3, startTime: Cesium.JulianDate, endTime: Cesium.JulianDate) => {
    var property = new Cesium.SampledPositionProperty();
    let endPosition = Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1]);
    let stopTime = Cesium.JulianDate.addSeconds(startTime, 5, new Cesium.JulianDate());
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
    viewer.clock.multiplier = 1.0;
    viewer.clock.shouldAnimate = true;
}
const handleMapLoaded = (cviewer: Cesium.Viewer) => {
    viewer = cviewer;
    loaded.value = true
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
            height: Number(0),
        };
        target.value = coordinate;
        viewer.entities.remove(targetEntity.value)
        deploy()
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
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
    padding: 20px;
    border: 1px solid rgba(139, 139, 139, 0.2);
    background-color: #222222;

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