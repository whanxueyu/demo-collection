<template>
  <div class="menubox">
    <el-color-picker v-model="lineColor" show-alpha color-format="hex"></el-color-picker>
    <el-button type="primary" @click="changeTool('drawLine')">添加线</el-button>
    <el-button type="primary" @click="changeTool('drawVolume')">添加管道</el-button>
    <el-button type="primary" @click="loadRadar">添加雷达</el-button>
  </div>
  <Map @loaded="handleMapLoaded" :duration="0" map-type="tileGrid"></Map>
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
var viewer: Cesium.Viewer;
const loaded = ref(false);

const mapData = reactive({
  lineTempPos: [],
  volumeTempPos: []
})
const lineColor = ref('#000000')
const activeTool = ref('')

const changeTool = (name: string) => {
  activeTool.value = name
}
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
const loadRadar = () => {
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
const drawLine = () => {
  //   let uuid = generateUniqueId()
  if (mapData.lineTempPos.length === 0) return
  var _update = function () {
    return mapData.lineTempPos
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
var primitive: Cesium.Primitive = null;
var handler;
const drawVolume = () => {
  var geometry = new Cesium.PolylineVolumeGeometry({
    polylinePositions: mapData.volumeTempPos,
    vertexFormat: Cesium.VertexFormat.POSITION_NORMAL_AND_ST,
    shapePositions: computeCircle(10.0),
    cornerType: Cesium.CornerType.MITERED,
  })
  if (primitive) {
    viewer.scene.primitives.remove(primitive)
  }
  // Add all instances to primitives.
  primitive = viewer.scene.primitives.add(
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

  // viewer.camera.flyToBoundingSphere(
  //   Cesium.PolylineVolumeGeometry.createGeometry(geometry).boundingSphere
  // )
  if (!handler)
    handler = viewer.scene.preUpdate.addEventListener(function () {
      var offset = primitive.appearance.material.uniforms.offset
      offset += 0.001
      if (offset > 1.0) {
        offset = 0.0
      }
      primitive.appearance.material.uniforms.offset = offset
    })
}
const handleMapLoaded = (cviewer) => {
  viewer = cviewer;
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  loaded.value = true
  handler.setInputAction(handleLeftClick.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction(function (event) {
    activeTool.value === '';
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  handler.setInputAction(handleRightClick.bind(this), Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  handler.setInputAction(handleMouseMove.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}
const handleLeftClick = (event) => {
  let ray = viewer.camera.getPickRay(event.position);
  let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
  // let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  // let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
  // let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
  // let coordinate = {
  //     longitude: Number(lng.toFixed(6)),
  //     latitude: Number(lat.toFixed(6)),
  //     height: Number(cartographic.height.toFixed(6)),
  // };
  if (activeTool.value === 'drawLine') {
    mapData.lineTempPos.push(cartesian);
    drawLine()
  } else if (activeTool.value === 'drawVolume') {
    mapData.volumeTempPos.push(cartesian);
    drawVolume()
  }
}
const handleRightClick = (event) => {
  if (activeTool.value === 'drawLine') {
    mapData.lineTempPos.pop();
  } else if (activeTool.value === 'drawVolume') {
    mapData.volumeTempPos.pop();
    drawVolume()
  }
}
const handleMouseMove = (event) => {
  let ray = viewer.camera.getPickRay(event.endPosition);
  let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
  // if (cartesian) {
  //   if (activeTool.value === 'drawLine') {
  //     mapData.lineTempPos.pop();
  //     mapData.lineTempPos.push(cartesian);
  //   } else if (activeTool.value === 'drawVolume') {
  //     mapData.volumeTempPos.pop();
  //     mapData.lineTempPos.push(cartesian);
  //   }
  // }

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