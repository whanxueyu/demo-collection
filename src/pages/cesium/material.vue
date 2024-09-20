<template>
  <div class="menubox">
    <el-color-picker v-model="lineColor" show-alpha color-format="hex"></el-color-picker>
    <el-button :type="activeTool === 'drawLine' ? 'success' : 'primary'" @click="changeTool('drawLine')">添加线</el-button>
    <el-button :type="activeTool === 'drawVolume' ? 'success' : 'primary'"
      @click="changeTool('drawVolume')">添加管道</el-button>
    <el-button :type="activeTool === 'drawScanRadar' ? 'success' : 'primary'"
      @click="changeTool('drawScanRadar')">添加雷达</el-button>
    <el-button :type="activeTool === 'drawPlane' ? 'success' : 'primary'"
      @click="changeTool('drawPlane')">视频面板</el-button>
    <video id="trailer" style="width:0px" controls autoplay muted loop>
      <source src="@/assets/oceans.mp4" type="video/mp4">
      Your browser does not support the <code>video</code> element.
    </video>
    <!-- <div id="trailer">
      <borderDiv html-content="88888"></borderDiv>
    </div> -->
  </div>
  <Map @loaded="handleMapLoaded" :duration="0" map-type="gd_v"></Map>
  <status-bar v-if="loaded" :viewer="viewer"></status-bar>
  <imageryEditer  v-if="loaded" :viewer="viewer"></imageryEditer>
</template>
<script>

</script>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import * as Cesium from "cesium";
import { ceratBezierLine, points } from './tool'
import Map from '@/components/cesium/map.vue'
import 'cesium/Source/Widgets/widgets.css';
import PolylineTrailLinkMaterialProperty from '@/modules/material/PolylineTrailLinkMaterial'
import statusBar from '@/components/cesium/status-bar.vue'
import radaeScanMaterial from "@/modules/material/radaeScanMaterial";
import volumeFlowMaterial from "@/modules/material/volumeFlowMaterial";
import radaeEffectAppearance from "@/modules/material/radaeEffectAppearance";
import wallMaterial from "@/modules/material/wallMaterial";
import migrationLineMaterial from "@/modules/material/migrationLineMaterial";
import verticalLineMaterial from "@/modules/material/verticalLineMaterial";
import EllipsoidElectricMaterialProperty from "@/modules/material/EllipsoidElectricMaterial";
import imageryEditer from '@/components/cesium/imageryEditer.vue'
var viewer: Cesium.Viewer;
const loaded = ref(false);

const mapData = reactive<{
  lineTempPos: Cesium.Cartesian3[];
  volumeTempPos: Cesium.Cartesian3[];
}>({
  lineTempPos: [],
  volumeTempPos: [],
})
const lineColor = ref('#000000')
const activeTool = ref('')
const handleMapLoaded = (cviewer) => {
  viewer = cviewer;
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  loaded.value = true;
  handler.setInputAction(handleMouseMove.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.setInputAction(handleLeftClick.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction(function (event) {
    activeTool.value = '';
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  handler.setInputAction(handleRightClick.bind(this), Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  drawRadar()
  drawWall()
  drawTailLine()
  drawEllipsoidElectric()
  drawVerticalLine()
}
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
const drawPlane = (center: Cesium.Cartesian3) => {
  activeTool.value = '';
  let cartographic = Cesium.Cartographic.fromCartesian(center);
  let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
  let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
  let alt = cartographic.height
  const videoElement = document.getElementById("trailer");
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(lng, lat, 540 + alt),
    plane: {
      plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0.0),
      dimensions: new Cesium.Cartesian2(1920.0, 1080.0),
      material: videoElement as any,
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    },
  });
}
const drawScanRadar = (center: Cesium.Cartesian3) => {
  activeTool.value = '';
  var circleGeometry = new Cesium.CircleGeometry({
    center: center,
    radius: 800.0,
    vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
  })
  var instance = new Cesium.GeometryInstance({
    geometry: circleGeometry,
  })
  viewer.scene.primitives.add(
    new Cesium.GroundPrimitive({
      geometryInstances: instance,
      appearance: new Cesium.MaterialAppearance({
        material: radaeScanMaterial(Cesium.Color.fromCssColorString('#ffff0f')),
      }),
    })
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
        material: volumeFlowMaterial(Cesium.Color.fromCssColorString('#f23f6f'))
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


// 材质有问题
const drawRadar = () => {
  var scene = viewer.scene
  // 雷达位置计算
  // 雷达的高度
  var length = 2000.0
  // 地面位置(垂直地面)
  var positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.273374, 39.972007)
  // 中心位置
  var centerOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.273374, 39.972007, length * 0.5)
  // 顶部位置(卫星位置)
  var topOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.273374, 39.972007, length)
  // 矩阵计算
  var modelMatrix = Cesium.Matrix4.multiplyByTranslation(
    Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid),
    new Cesium.Cartesian3(0.0, 0.0, length * 0.5),
    new Cesium.Matrix4()
  )
  //  创建雷达放射波
  //  先创建Geometry
  var cylinderGeometry = new Cesium.CylinderGeometry({
    length: length,
    topRadius: 0.0,
    bottomRadius: length * 0.5,
    vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat,
  })
  //  创建GeometryInstance
  var redCone = new Cesium.GeometryInstance({
    geometry: cylinderGeometry,
    modelMatrix: modelMatrix,
  })
  //  创建Primitive
  var radar = scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: redCone,
      appearance: radaeEffectAppearance(Cesium.Color.fromCssColorString('#62ef3f99')),
    })
  )

  // 动态修改雷达材质中的offset变量，从而实现动态效果。
  viewer.scene.preUpdate.addEventListener(function () {
    var offset = radar.appearance.material.uniforms.offset
    offset -= 0.001
    if (offset > 1.0) {
      offset = 0.0
    }
    radar.appearance.material.uniforms.offset = offset
  })
}
/**
 * 添加尾迹线
 */
const drawTailLine = () => {
  // let polylineGeometry = new Cesium.PolylineGeometry({
  //   positions: Cesium.Cartesian3.fromDegreesArrayHeights(ceratBezierLine([116.385975,39.908886], [116.396384,39.905387])),
  //   width: 2,
  // })
  let geometryInstances = []
  let startPoint = points['start'][Object.keys(points['start'])[0]]
  for (let key in points['end']) {
    let endPoint = points['end'][key]
    let polylineGeometry = new Cesium.PolylineGeometry({
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(ceratBezierLine(startPoint, endPoint)),
      width: 2,
    })
    let geometryInstance = new Cesium.GeometryInstance({ geometry: polylineGeometry })
    geometryInstances.push(geometryInstance)
  }
  var line = viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: geometryInstances,
      appearance: new Cesium.PolylineMaterialAppearance({
        material: migrationLineMaterial(Cesium.Color.fromCssColorString('#02ffff')),
      }),
    })
  )
  // viewer.camera.flyTo({ destination: Cartesian3.fromDegrees(startPoint[0], startPoint[1], 10000000) })
  viewer.scene.preUpdate.addEventListener(function () {
    var offset = line.appearance.material.uniforms.offset
    offset += 0.005
    if (offset > 1.0) {
      offset = 0.0
    }
    line.appearance.material.uniforms.offset = offset
  })
}
const generateRandomLines = (center, num) => {
  let geometryInstances = []
  for (let i = 0; i < num; i++) {
    let lon = center[0] + (Math.random() - 0.5) * 0.1;
    let lat = center[1] + (Math.random() - 0.5) * 0.1;
    const geometry = new Cesium.PolylineGeometry({
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        lon, lat, 0, lon, lat, 5000 * Math.random()
      ]),
      width: 1.0,
    })
    const instance = new Cesium.GeometryInstance({ geometry: geometry })
    geometryInstances.push(instance)
  }
  return geometryInstances
}
const drawVerticalLine = () => {
  viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: generateRandomLines([116.39, 39.959], 100),
      appearance: new Cesium.PolylineMaterialAppearance({
        material: verticalLineMaterial(Cesium.Color.fromCssColorString('#ff66f099')),
      }),
      allowPicking: false
    })
  )
  const center = Cesium.Cartesian3.fromDegrees(116.39, 39.959);
  viewer.camera.lookAt(center, new Cesium.Cartesian3(0.0, -10000.0, 3930.0));
  viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
}
const drawEllipsoidElectric = () => {
  // if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
  //   viewer.resolutionScale = window.devicePixelRatio
  // }
  viewer.scene.postProcessStages.fxaa.enabled = true
  const entity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.389339, 39.96747),
    name: '电弧球体',
    ellipsoid: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      material: new EllipsoidElectricMaterialProperty({
        color: Cesium.Color.fromCssColorString('#2968d9'),
        speed: 10.0
      })
    }
  })
  // viewer.zoomTo(entity)
}
const drawWall = () => {
  var greenWallInstance = new Cesium.GeometryInstance({
    geometry: Cesium.WallGeometry.fromConstantHeights({
      positions: Cesium.Cartesian3.fromDegreesArray([
        116.32308,
        39.902552,
        116.454928,
        39.902515,
        116.454928,
        40.02535,
        116.32395,
        40.02535,
        116.32308,
        39.902552,
      ]),
      maximumHeight: 1000.0,
      vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
    }),
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString('#409eff')),
    },
  })

  // Add green wall instances to primitives.
  var greenWall = viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: greenWallInstance,
      appearance: new Cesium.MaterialAppearance({
        material: wallMaterial(Cesium.Color.fromCssColorString('#f00e0f')),
      }),
    })
  )
  viewer.scene.preUpdate.addEventListener(function () {
    var greenoffset = greenWall.appearance.material.uniforms.offset
    greenoffset += 0.01
    if (greenoffset > 1.0) {
      greenoffset = 0.0
    }
    greenWall.appearance.material.uniforms.offset = greenoffset
  })
}
const handleLeftClick = (event) => {
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
  console.log(coordinate)
  if (activeTool.value === 'drawLine') {
    mapData.lineTempPos.push(cartesian);
    drawLine()
  } else if (activeTool.value === 'drawVolume') {
    mapData.volumeTempPos.push(cartesian);
    drawVolume()
  } else if (activeTool.value === 'drawScanRadar') {
    drawScanRadar(cartesian)
  } else if (activeTool.value === 'drawPlane') {
    drawPlane(cartesian)
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
  if (cartesian) {
    if (activeTool.value === 'drawLine') {

      if (mapData.lineTempPos.length > 0) {
        if (mapData.lineTempPos.length > 1) {
          mapData.lineTempPos.pop();
        }
        mapData.lineTempPos.push(cartesian);
      }
    } else if (activeTool.value === 'drawVolume') {
      if (mapData.volumeTempPos.length > 0) {
        if (mapData.volumeTempPos.length > 1) {
          mapData.volumeTempPos.pop();
        }
        mapData.volumeTempPos.push(cartesian);
        drawVolume()
      }
    }
  }
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