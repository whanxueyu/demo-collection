import * as Cesium from 'cesium';
/**
 * 贴地雷达扫描材质
 * @param color Cesium.Color
 * @returns Material
 */
const volumeFlowMaterial = (color: Cesium.Color) => {
  return new Cesium.Material({
    fabric: {
      uniforms: {
        color: color,
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
  })
}

export default volumeFlowMaterial