import * as Cesium from 'cesium';
/**
 * 墙
 * @param color Cesium.Color
 * @returns appearance  primitive.appearance
 */
const wallMaterial = (color: Cesium.Color) => {
    return new Cesium.Material({
        fabric: {
            uniforms: {
                color: color,
                offset: 0.0,
            },
            source: `
                            uniform vec4 color;
                            uniform float offset;
                            czm_material czm_getMaterial(czm_materialInput materialInput)
                            {
                                czm_material material = czm_getDefaultMaterial(materialInput);
                                vec2 st = materialInput.st;
                                material.diffuse = color.rgb;
                                material.alpha = fract(1.0 - st.t + offset);
                                material.emission=vec3(0.5);
                                return material;
                            }`,
        },
    })
}
export default wallMaterial