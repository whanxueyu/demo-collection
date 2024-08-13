<template>
    <div class="menubox">
        <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="矩阵" name="rect"></el-tab-pane>
            <el-tab-pane label="圆形" name="circle"></el-tab-pane>
            <el-tab-pane label="楔形" name="wedge"></el-tab-pane>
            <el-tab-pane label="清除">
                <div class="tab-body">
                    <el-button type="danger" @click="removeAll">清除全部</el-button>
                    <el-divider content-position="left">说明</el-divider>
                    <div class="text" type="primary">将清除所有的实体</div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div>
            <el-button @click="deploy" type="primary">部署</el-button>
            <el-button :icon="Refresh" @click="reset" type="success"></el-button>
            <div>人数：
                <el-input-number :min="4" :max="1000" v-model="totalNumber" :step="1"
                    @change=handleNumberChange></el-input-number>
            </div>
            <div>层数：
                <el-input-number :min="1" :max="1000" v-model="circleMunber" :step="1"
                    @change=handleCircleChange></el-input-number>
            </div>
        </div>
    </div>
    <Map @loaded="handleMapLoaded" :lazy="false" :duration="0" map-type="grid"></Map>
</template>

<script setup lang="ts">
import * as turf from "@turf/turf";
import { nextTick, onMounted, ref } from "vue";
import * as Cesium from "cesium";
import Map from '@/components/cesium/map.vue'
import 'cesium/Source/Widgets/widgets.css';
import { Refresh } from '@element-plus/icons-vue'
import { calculateRadius, getCirclePosition } from './tool'
var viewer: Cesium.Viewer;
const activeName = ref('rect');
const target = ref({
    longitude: 116.391257,
    latitude: 39.907204,
    height: 0,
});
const totalNumber = ref(4);
const circleMunber = ref(1);
const entitiyList = ref<Cesium.Entity[]>([]);
const targetEntity = ref<Cesium.Entity>();
const handleNumberChange = () => {
    console.log(totalNumber.value)
    entitiyList.value.forEach((entity: Cesium.Entity) => {
        viewer.entities.remove(entity)
    })
    nextTick(() => {
        switch (activeName.value) {
            case "rect":
                // addRect(coordinates);
                break
            case "circle":
                let radius = calculateRadius(totalNumber.value, 1.5)
                let circle = getCirclePosition(target.value, radius, totalNumber.value)
                const coordinates = circle.geometry.coordinates[0];
                addCircle(coordinates)
                break
            case "wedge":
                // addWedge(coordinates)
                break
        }
    })
}
const handleCircleChange = () => {
    console.log(circleMunber.value)
}

const addCircle = (coordinates) => {
    coordinates.forEach((coordinate, index) => {
        const position = Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1]);
        var point1 = turf.point([target.value.longitude, target.value.latitude]);
        var point2 = turf.point([coordinate[0], coordinate[1]]);
        const heading = turf.bearing(point1, point2);
        let model = viewer.entities.add({
            name: "锚点",
            position: position,
            orientation: Cesium.Transforms.headingPitchRollQuaternion(
                position,
                Cesium.HeadingPitchRoll.fromDegrees(heading + 90, 0, 0)
            ),
            model: {
                uri: '/models/Cesium_Man.glb',

                // scale: 0.5,
            },
        })
        entitiyList.value.push(model)
    });
}
const addRect = (coordinates) => {
    coordinates.forEach((coordinate, index) => {
        const position = Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1]);
        let model = viewer.entities.add({
            name: "锚点",
            position: position,
            model: {
                uri: '/models/Cesium_Man.glb',
            },
        })
        entitiyList.value.push(model)
    });
}
const deploy = () => {
    targetEntity.value = viewer.entities.add({
        name: "锚点",
        position: Cesium.Cartesian3.fromDegrees(target.value.longitude, target.value.latitude, target.value.height),
        billboard: {
            image: require('@/assets/icon/marker.png'),
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: 0.5,
        },
        label: {
            text: '锚点',
            font: '14pt sans-serif',
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(-15, -70),
        }
    })
}
const handleMapLoaded = (cviewer: Cesium.Viewer) => {
    viewer = cviewer;
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
        destination: Cesium.Cartesian3.fromDegrees(116.391257, 39.907204, 100),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0,
        },
        duration: 1
    });
}
const removeAll = () => {
    viewer.entities.removeAll()
    sessionStorage.removeItem('markers')
}
onMounted(() => {

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
</style>