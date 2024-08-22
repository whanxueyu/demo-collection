<template>
    <div class="menubox">
        <el-switch v-model="activeTool" active-value="drawLine" inactive-value=""></el-switch>
        <el-color-picker v-model="lineColor" show-alpha color-format="hex"></el-color-picker>
        <el-button type="parimary" @click="loadData">添加管道</el-button>
        <el-button type="parimary" @click="loadRadar">添加雷达</el-button>
        <el-button type="parimary" @click="loadRadar">添加雷达</el-button>
    </div>
    <Map @loaded="handleMapLoaded" map-type="tileGrid"></Map>
    <status-bar v-if="loaded" :viewer="viewer"></status-bar>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import * as Cesium from "cesium";
import Map from '@/components/cesium/map.vue'
import 'cesium/Source/Widgets/widgets.css';
import PolylineTrailLinkMaterialProperty from '@/modules/material/PolylineTrailLinkMaterial'
// import SpriteLineMaterialProperty from '@/modules/material/SpriteLineMaterialProperty'
import statusBar from '@/components/cesium/status-bar.vue'
import radaeScanMaterial from "@/modules/material/radaeScanMaterial";
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

const loadData = () => {
    function computeCircle(radius) {
        var positions = []
        for (var i = 0; i < 360; i++) {
          var radians = Cesium.Math.toRadians(i)
          positions.push(
            new Cesium.Cartesian2(
              radius * Math.cos(radians),
              radius * Math.sin(radians)
            )
          )
        }
        return positions
      }
      // Create the polyline volume geometry instance.  The shape defined by the
      // shapePositions option will be extruded along the polylinePositions.
      var geometry = new Cesium.PolylineVolumeGeometry({
        polylinePositions: Cesium.Cartesian3.fromDegreesArray([
          -85.0,
          32.0,
          -85.0,
          36.0,
          -89.0,
          36.0,
        ]),
        vertexFormat: Cesium.VertexFormat.POSITION_NORMAL_AND_ST,
        shapePositions: computeCircle(6000.0),
        cornerType: Cesium.CornerType.MITERED,
      })

      // Add all instances to primitives.
      var primitive = viewer.scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances: new Cesium.GeometryInstance({
            geometry: geometry,
          }),
          appearance: new Cesium.MaterialAppearance({
            material: new Cesium.Material({
              fabric: {
                uniforms: {
                  color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
                  percentage: 0.1,
                  offset: 0.0,
                },
                source: `
                  uniform vec4 color;
                  uniform float percentage;
                  uniform float offset;
                  czm_material czm_getMaterial(czm_materialInput materialInput)
                  {
                      czm_material material = czm_getDefaultMaterial(materialInput);
                      vec2 st = materialInput.st;
                      material.diffuse = color.rgb;
                      material.alpha = 1.0-mod(st.s+offset,percentage)*(1.0/percentage);
                      return material;
                  }`,
              },
            }),
          }),
        })
      )

      viewer.camera.flyToBoundingSphere(
        Cesium.PolylineVolumeGeometry.createGeometry(geometry).boundingSphere
      )

      viewer.scene.preUpdate.addEventListener(function() {
        var offset = primitive.appearance.material.uniforms.offset
        offset += 0.001
        if (offset > 1.0) {
          offset = 0.0
        }
        primitive.appearance.material.uniforms.offset = offset
      })
}
const loadRadar = ()=>{
    var circleGeometry = new Cesium.CircleGeometry({
        center: Cesium.Cartesian3.fromDegrees(-74.02, 40.69),
        radius: 200.0,
        vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
      })
      var instance = new Cesium.GeometryInstance({
        geometry: circleGeometry,
      })
      viewer.scene.primitives.add(
        new Cesium.GroundPrimitive({
          geometryInstances: instance,
          appearance: new Cesium.MaterialAppearance({
            material: radaeScanMaterial(new Cesium.Color(0.0, 1.0, 0.0)),
          }),
        })
      )
      viewer.camera.flyToBoundingSphere(
        Cesium.CircleGeometry.createGeometry(circleGeometry).boundingSphere
      )
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
    handler.setInputAction(function (event) {
        if (activeTool.value === 'drawLine') {
            mapData.tempSketch.pop();
            drawSketch()
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    handler.setInputAction(function (event) {
        activeTool.value === ''
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
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