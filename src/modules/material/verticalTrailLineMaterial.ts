import * as Cesium from 'cesium';
/**
 * 竖直尾线
 * @param color Cesium.Color
 * @returns Cesium.Material
 */
const verticalTrailLineMaterial = (color: Cesium.Color) => {
    return new Cesium.Material({
        fabric: {
            uniforms: {
                color: color,
                speed: 5.0,
                percent: 0.2,
                gradient: 0.00
            },
            source: `
        uniform vec4 color;
        uniform float speed;
        uniform float percent;
        uniform float gradient;
        
        czm_material czm_getMaterial(czm_materialInput materialInput){
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 st = materialInput.st;
          float t = fract(czm_frameNumber * speed / 1000.0);
          t *= (1.0 + percent);
          float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);
          alpha += gradient;
          material.diffuse = color.rgb;
          material.alpha = alpha;
          material.emission = vec3(0.7);
          return material;
        }
        `
        },
    })
}
export default verticalTrailLineMaterial