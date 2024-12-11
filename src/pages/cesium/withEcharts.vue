<template>
    <div class="menubox">
    </div>
    <Map @loaded="handleMapLoaded" :duration="0" map-type="gd_v"></Map>
    <status-bar v-if="loaded" :viewer="viewer"></status-bar>
</template>
<script>

</script>
<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import * as Cesium from "cesium";
import Map from '@/components/cesium/map.vue'
import statusBar from '@/components/cesium/status-bar.vue'
import * as echarts from "echarts"
import EchartsLayer from './echartsLayer.js'
import { geoOption, pieOption, pieOption2 } from './chartData.ts';
var viewer: Cesium.Viewer;
const loaded = ref(false);
const handleMapLoaded = (Viewer) => {
    viewer = Viewer;
    loaded.value = true;
    drawPie(pieOption, { lon: 116, lat: 39 })
    drawPie(pieOption2, { radius: 50000, lon: 103, lat: 34 })
    nextTick(() => {
        addEcharts(viewer)
    })
}
function drawPie(options, { radius = 100000.0, lon, lat }) {
    let canvasDom = document.createElement('canvas');
    canvasDom.width = 400;
    canvasDom.height = 400;
    let myChart = echarts.init(canvasDom);
    myChart.setOption(options);
    myChart.on('finished', () => {
        let criclePrimitive = getCriclePrimitive(myChart, { radius, lon, lat })
        viewer.scene.primitives.add(criclePrimitive)
        myChart.dispose();
        myChart = null;
        canvasDom = null;
    })
}
const getCriclePrimitive = (chart, { radius = 100000.0, lon, lat }) => {
    let circle = new Cesium.CircleGeometry({
        center: Cesium.Cartesian3.fromDegrees(lon, lat),
        radius: radius
    });
    let circleGeometry = Cesium.CircleGeometry.createGeometry(circle);
    let circleGeometryInstance = new Cesium.GeometryInstance({
        geometry: circleGeometry,
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.ORANGE)
        }
    });
    let criclePrimitive = new Cesium.Primitive({
        geometryInstances: [
            circleGeometryInstance
        ],
        asynchronous: false,
        appearance: new Cesium.MaterialAppearance({
            material:
                new Cesium.Material({
                    fabric: {
                        type: 'Image',
                        uniforms: {
                            image: chart.getDataURL()
                        }
                    }
                })
        })
    })
    return criclePrimitive;
}

let layer: EchartsLayer
const addEcharts = (viewer: Cesium.Viewer) => {
    if (!layer) {
        layer = new EchartsLayer(viewer, geoOption)
        console.log("addEcharts", layer)
    }
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(117.16, 32.71, 10000000.0)
    })
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

    .tab-body {
        width: 250px;

        .text {
            line-height: 24px;
            text-indent: 24px;
            text-align: start;
        }
    }
}

#toolbar {
    background-color: #3339;
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