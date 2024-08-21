<template>
    <div class="menubox">
        <el-switch v-model="activeTool" active-value="drawLine" inactive-value=""></el-switch>
        <el-color-picker v-model="lineColor" show-alpha color-format="hex"></el-color-picker>
        <div id="toolbar">
            <table>
                <tbody>
                    <tr>
                        <td>Brightness</td>
                        <td>
                            <input @change="setParmas('brightness')" type="range" min="0" max="3" step="0.02"
                                v-model="viewModel.brightness">
                            <input @change="setParmas('brightness')" type="text" size="5"
                                v-model="viewModel.brightness">
                        </td>
                    </tr>
                    <tr>
                        <td>Contrast</td>
                        <td>
                            <input @change="setParmas('contrast')" type="range" min="0" max="3" step="0.02"
                                v-model="viewModel.contrast">
                            <input @change="setParmas('contrast')" type="text" size="5" v-model="viewModel.contrast">
                        </td>
                    </tr>
                    <tr>
                        <td>Hue</td>
                        <td>
                            <input @change="setParmas('hue')" type="range" min="0" max="3" step="0.02"
                                v-model="viewModel.hue">
                            <input @change="setParmas('hue')" type="text" size="5" v-model="viewModel.hue">
                        </td>
                    </tr>
                    <tr>
                        <td>Saturation</td>
                        <td>
                            <input @change="setParmas('saturation')" type="range" min="0" max="3" step="0.02"
                                v-model="viewModel.saturation">
                            <input @change="setParmas('saturation')" type="text" size="5"
                                v-model="viewModel.saturation">
                        </td>
                    </tr>
                    <tr>
                        <td>Gamma</td>
                        <td>
                            <input @change="setParmas('gamma')" type="range" min="0" max="3" step="0.02"
                                v-model="viewModel.gamma">
                            <input @change="setParmas('gamma')" type="text" size="5" v-model="viewModel.gamma">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <Map @loaded="handleMapLoaded"></Map>
    <status-bar v-if="loaded" :viewer="viewer"></status-bar>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import * as Cesium from "cesium";
import Map from '@/components/cesium/map.vue'
import 'cesium/Source/Widgets/widgets.css';
import { LocationInformation, Delete, Refresh, OfficeBuilding, Rank, Picture, EditPen, Share } from '@element-plus/icons-vue'
import { ElMessage } from "element-plus";
import PolylineTrailLinkMaterialProperty from '@/modules/material/PolylineTrailLinkMaterial'
import statusBar from '@/components/cesium/status-bar.vue'
var viewer;
const loaded = ref(false);
const viewModel = reactive({
    brightness: 0,
    contrast: 0,
    hue: 0,
    saturation: 0,
    gamma: 0,
})
const mapData = reactive({
    tempSketch: []
})
const lineColor = ref('#000000')
const activeTool = ref('')
const imageryLayers = ref()
// Make the viewModel react to base layer changes.
function updateViewModel() {
    if (imageryLayers.value.length > 0) {
        const layer = imageryLayers.value.get(0);
        viewModel.brightness = layer.brightness;
        viewModel.contrast = layer.contrast;
        viewModel.hue = layer.hue;
        viewModel.saturation = layer.saturation;
        viewModel.gamma = layer.gamma;
    }
}

const setParmas = (name: string) => {
    const layer = imageryLayers.value.get(0);
    if (layer) {
        layer[name] = viewModel[name]
    }
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
            width: 8,
            material: new PolylineTrailLinkMaterialProperty('https://gd-hbimg.huaban.com/679a707a941eacbc2601e34bbc4ce41d6f30f9f0c44a-CdmHDR_fw1200webp', Cesium.Color.fromCssColorString(lineColor.value), 2000)
        },
        show: true,
    })
}
const handleMapLoaded = (cviewer) => {
    viewer = cviewer;
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    loaded.value = true
    imageryLayers.value = viewer.imageryLayers;

    nextTick(() => {
        updateViewModel()
    })
    handler.setInputAction(function (event) {
        let ray = viewer.camera.getPickRay(event.position);
        let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
        let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
        let coordinate = {
            longitude: Number(lng.toFixed(6)),
            latitude: Number(lat.toFixed(6)),
            height: Number(cartographic.height.toFixed(6)),
        };
        if (activeTool.value === 'drawLine') {
            mapData.tempSketch.push(cartesian);
            drawSketch()
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
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