<template>
    <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>
   
<script>
import { nextTick, onMounted } from "vue";
import * as Cesium from "cesium";
import 'cesium/Source/Widgets/widgets.css';
var viewer;
//定义一些常量
// var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;
export default {
    setup() {
        const tilesets = [
            './3dTileset/a/tileset.json',
            './3dTileset/b/tileset.json',
            './3dTileset/c/tileset.json',
            './3dTileset/d/tileset.json',
            './3dTileset/e/tileset.json',
            './3dTileset/f/tileset.json',
            './3dTileset/g/tileset.json',
            './3dTileset/h/tileset.json',
            './3dTileset/i/tileset.json',
            './3dTileset/j/tileset.json',
            './3dTileset/k/tileset.json',
            './3dTileset/l/tileset.json',
            './3dTileset/m/tileset.json',
            './3dTileset/n/tileset.json',
            './3dTileset/o/tileset.json',
            './3dTileset/p/tileset.json',
            './3dTileset/q/tileset.json',
            './3dTileset/r/tileset.json',
            './3dTileset/s/tileset.json',
            './3dTileset/t/tileset.json',
            './3dTileset/u/tileset.json',
            './3dTileset/v/tileset.json',
            './3dTileset/w/tileset.json',
            './3dTileset/x/tileset.json',
            './3dTileset/y/tileset.json',
            './3dTileset/z/tileset.json',
            './3dTileset/aa/tileset.json',
            './3dTileset/ab/tileset.json',
            './3dTileset/ac/tileset.json',
            './3dTileset/ad/tileset.json',
        ]
        const initCesium = () => {
            Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxZDU4MDE4ZS03ODdmLTQ1NWMtYTI3Ny1kMmQxNmVkYmQxZDQiLCJpZCI6NjMxNjUsImlhdCI6MTYzMjg3OTg1NX0.AAtivmdf46L1-4MWLWjnQRgP_laeTXBMagA75_a9N9o";
            // 高德地图影像图
            var atLayer = new Cesium.UrlTemplateImageryProvider({
                // url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}", //高德影像
                // url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", //高德矢量图
                url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8", //高德路网中文注记
                minimumLevel: 1,
                maximumLevel: 18
            })
            var atLayer1 = new Cesium.UrlTemplateImageryProvider({
                url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}", //高德影像
                // url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", //高德矢量图
                // url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8", //高德路网中文注记
                minimumLevel: 1,
                maximumLevel: 18
            })
            viewer = new Cesium.Viewer("cesiumContainer", {
                infoBox: false,
                selectionIndicator: false,
                sceneModePicker: false,
                animation: false,    //左下角的动画仪表盘
                baseLayerPicker: false,  //右上角的图层选择按钮
                geocoder: false,  //搜索框
                homeButton: false,  //home按钮
                timeline: false,    //底部的时间轴
                navigationHelpButton: false,  //右上角的帮助按钮，
                fullscreenButton: false,
            });
            console.log(atLayer, atLayer1)
            viewer.imageryLayers.addImageryProvider(atLayer1);
            // viewer.imageryLayers.addImageryProvider(atLayer);
            viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
            viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG];
            viewer.cesiumWidget.creditContainer.style.display = "none";
            // viewer.scene.screenSpaceCameraController.enableTranslate = false;
            viewer.scene.screenSpaceCameraController.enableRotate = true; //拖拽旋转
            viewer.scene.screenSpaceCameraController.enableTilt = true; //右键拖拽倾斜
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(117.08922, 39.09498, 600),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-60),
                    roll: 0.0,
                },
            });
            nextTick(() => {
                loadModel()
                addMark()
            })
        }
        const addMark = () => {
            viewer.entities.add({
                name: '公司',
                position: Cesium.Cartesian3.fromDegrees(117.089, 39.098, 20),
                billboard: {
                    image: require('../../assets/icon/company.png'),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    scale: 0.5,
                }
            })
            viewer.entities.add({
                name: '房子',
                position: Cesium.Cartesian3.fromDegrees(117.03, 39.08, 100),
                billboard: {
                    image: require('../../assets/icon/house.png'),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    scale: 0.5,
                }
            })
            viewer.entities.add({
                name: '天安门',
                position: Cesium.Cartesian3.fromDegrees(116.40, 39.91, 100),
                billboard: {
                    image: require('../../assets/icon/star.png'),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    scale: 0.5,
                }
            })
            viewer.entities.add({
                name: '家',
                position: Cesium.Cartesian3.fromDegrees(103.96, 35.80, 100),
                billboard: {
                    image: require('../../assets/icon/home.png'),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    scale: 0.5,
                }
            })
        }
        const loadModel = () => {
            for (let i = 0; i < tilesets.length; i++) {
                Cesium.Cesium3DTileset.fromUrl(tilesets[i]).then(function (tileset) {
                    viewer.scene.primitives.add(tileset);
                    // 1111111111111111
                    // var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(90));
                    // var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(0));
                    // var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(0));
                    // var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
                    // var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
                    // var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
                    // //平移 修改经纬度
                    // //旋转、平移矩阵相乘
                    // Cesium.Matrix4.multiply(m, rotationX, m);
                    // Cesium.Matrix4.multiply(m, rotationY, m);
                    // Cesium.Matrix4.multiply(m, rotationZ, m);
                    // var mtx = Cesium.Transforms.eastNorthUpToFixedFrame(position);
                    // Cesium.Matrix4.multiplyByUniformScale(mtx, opt.scale, mtx);
                    // var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(90)); //绕x轴旋转
                    // var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
                    // Cesium.Matrix4.multiply(mtx, rotationX, mtx);
                    // 222222222222222222222
                    const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
                    const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
                    const m = Cesium.Transforms.eastNorthUpToFixedFrame(surface);
                    Cesium.Matrix4.multiplyByUniformScale(m, 1, m);
                    var mx = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(1)); //绕x轴旋转
                    var rotationZ = Cesium.Matrix4.fromRotationTranslation(mx);
                    Cesium.Matrix4.multiply(m, rotationZ, m);

                    const tempTranslation = new Cesium.Cartesian3(250, -230, -10);
                    const offset = Cesium.Matrix4.multiplyByPoint(m, tempTranslation, new Cesium.Cartesian3(0, 0, 0));
                    const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
                    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

                    shader(tileset)
                });

                // tileset.readyPromise.then(function () {
                //     viewer.scene.primitives.add(tileset);
                // const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
                // const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
                // const m = Cesium.Transforms.eastNorthUpToFixedFrame(surface);

                // const tempTranslation = new Cesium.Cartesian3(-650, -650);
                // const tempTranslation = new Cesium.Cartesian3(-310, -350, 0);
                // const offset = Cesium.Matrix4.multiplyByPoint(m, tempTranslation, new Cesium.Cartesian3(0, 0, 0));
                // const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
                // tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
                // const mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(-3));
                // const rotate = Cesium.Matrix4.fromRotationTranslation(mz);
                // Cesium.Matrix4.multiply(m, rotate, m);
                // tileset._root.transform = m;
                // });
            }
        }
        const shader1 = (tile) => {
            tile.tileVisible.addEventListener(function (res) {
                let content = res.content;
                let featuresLength = content.featuresLength;
                console.log(content)
                for (let i = 0; i < featuresLength; i += 2) {
                    let feature = content.getFeature(i);
                    let model = feature.content._model;
                    if (model && model._pipelineResources) {
                        let program = model._pipelineResources[1];
                        const color = `vec4(0,127.5/255.,1.,1.)`;
                        program._fragmentShaderSource.sources[0] = `
							uniform vec2 model_iblFactor;
							uniform mat3 model_iblReferenceFrameMatrix;
							uniform float model_luminanceAtZenith;
							uniform float u_metallicFactor;
							uniform float u_roughnessFactor;
							uniform int model_featuresLength;
							uniform sampler2D model_batchTexture;
							uniform vec4 model_textureStep;
							uniform float model_colorBlend;
							uniform bool model_commandTranslucent;
							uniform sampler2D model_pickTexture;
							varying vec3 v_positionWC;
							varying vec3 v_positionEC;
							varying vec3 v_normalEC;
							varying vec3 v_positionMC;
							varying float v_featureId_0;
							struct SelectedFeature
							{
								int id;
								vec2 st;
								vec4 color;
							};
							struct FeatureIds
							{
								int featureId_0;
							};
							vec2 computeSt(float featureId)
							{
								float stepX = model_textureStep.x;
								float centerX = model_textureStep.y;

								#ifdef MULTILINE_BATCH_TEXTURE
								float stepY = model_textureStep.z;
								float centerY = model_textureStep.w;

								float xId = mod(featureId, model_textureDimensions.x); 
								float yId = floor(featureId / model_textureDimensions.x);
								
								return vec2(centerX + (xId * stepX), centerY + (yId * stepY));
								#else
								return vec2(centerX + (featureId * stepX), 0.5);
								#endif
							}
							void selectedFeatureIdStage(out SelectedFeature feature, FeatureIds featureIds)
							{   
								int featureId = featureIds.SELECTED_FEATURE_ID;
								if (featureId < model_featuresLength)
								{
									vec2 featureSt = computeSt(float(featureId));

									feature.id = featureId;
									feature.st = featureSt;
									feature.color = texture2D(model_batchTexture, featureSt);
								}
								else
								{
									feature.id = model_featuresLength + 1;
									feature.st = vec2(0.0);
									feature.color = vec4(1.0);
								}

								#ifdef HAS_NULL_FEATURE_ID
								if (featureId == model_nullFeatureId) {
									feature.id = featureId;
									feature.st = vec2(0.0);
									feature.color = vec4(1.0);
								}
								#endif
							}
							SelectedFeature selectedFeature;
							void main(){
								vec4 position = czm_inverseModelView * vec4(v_positionEC,1.);//获取模型的世界坐标
								float buildMaxHeight = 300.0;//建筑群最高高度 配渐变色
								gl_FragColor = ${color};//赋予基础底色
								gl_FragColor *= vec4(vec3(position.y / buildMaxHeight ), 1.0);//根据楼层高度比例渲染渐变色
								float time = abs(fract(czm_frameNumber / 360.0)-0.5)*2.;//动画频率 约束在(0,1) 更改频率修改360.0
								float diffuse = step(0.005, abs(clamp(position.y / buildMaxHeight, 0.0, 1.0) - time));//根据帧数变化,光圈颜色白色,由底部朝上一丢丢(0.05)开始逐渐上移显现.
								gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diffuse );//单纯叠加颜色 感兴趣的可以mix混合下
							}
						`;
                    }
                }
            })
        }
        const shader = (tile) => {
            console.log(tile)
            tile.style = new Cesium.Cesium3DTileStyle({
                color: {
                    conditions: [
                        ['true', 'rgba(0, 127.5, 255 ,0.4)']
                    ]
                }
            });
            tile.tileVisible.addEventListener(function (tile) {
                var content = tile.content;
                var featuresLength = content.featuresLength;
                for (let i = 0; i < featuresLength; i += 2) {
                    let feature = content.getFeature(i)
                    let model = feature.content._model

                    if (model && model._sourcePrograms && model._rendererResources) {
                        Object.keys(model._sourcePrograms).forEach(key => {
                            let program = model._sourcePrograms[key]
                            let fragmentShader = model._rendererResources.sourceShaders[program.fragmentShader];
                            let v_position = "";
                            if (fragmentShader.indexOf(" v_positionEC;") != -1) {
                                v_position = "v_positionEC";
                            } else if (fragmentShader.indexOf(" v_pos;") != -1) {
                                v_position = "v_pos";
                            }
                            const color = `vec4(${feature.color.toString()})`;

                            model._rendererResources.sourceShaders[program.fragmentShader] =
                                `
            varying vec3 ${v_position};
            void main(void){
              vec4 position = czm_inverseModelView * vec4(${v_position},1); // 位置
              gl_FragColor = ${color}; // 颜色
              gl_FragColor *= vec4(vec3(position.z / 50.0), 1.0); // 渐变
              // 动态光环
              float time = fract(czm_frameNumber / 180.0);
              time = abs(time - 0.5) * 2.0;
              float glowRange = 180.0; // 光环的移动范围(高度)
              float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
              gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
            }
          `
                        })
                        model._shouldRegenerateShaders = true
                    }
                }
            });
        }
        const gcj02towgs84 = (lng, lat) => {
            if (out_of_china(lng, lat)) {
                return [lng, lat]
            }
            else {
                var dlat = transformlat(lng - 105.0, lat - 35.0);
                var dlng = transformlng(lng - 105.0, lat - 35.0);
                var radlat = lat / 180.0 * PI;
                var magic = Math.sin(radlat);
                magic = 1 - ee * magic * magic;
                var sqrtmagic = Math.sqrt(magic);
                dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
                dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
                var mglat = lat + dlat;
                var mglng = lng + dlng;
                return [lng * 2 - mglng, lat * 2 - mglat]
            }
        }
        const transformlat = (lng, lat) => {
            var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
            return ret
        }

        const transformlng = (lng, lat) => {
            var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
            return ret
        }
        const out_of_china = (lng, lat) => {
            return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
        }
        onMounted(() => {
            initCesium()
        })
        return {
            gcj02towgs84,
            shader1,
            shader
        }
    }
}
</script>
   
<style>
#cesiumContainer {
    width: 100vw;
    height: calc(100vh - 60px);
}
</style>