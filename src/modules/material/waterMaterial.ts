import * as Cesium from 'cesium';
/**
 * 水面
 * @param color Cesium.Color
 * @returns Material
 */
const waterMaterial = (color: Cesium.Color) => {
  return new Cesium.Material({
    fabric: {
      type: "Water",
      uniforms: {
        baseWaterColor: new Cesium.Color(64 / 255.0, 157 / 255.0, 200 / 255.0, 0.5),
        normalMap: Cesium.buildModuleUrl("Assets/Textures/waterNormals.jpg"),
        frequency: 1000.0,
        animationSpeed: 0.1,
        amplitude: 10,
        specularIntensity: 10
      }
    }
  })
}
export default waterMaterial