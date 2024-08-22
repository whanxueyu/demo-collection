import * as Cesium from 'cesium';
/**
 * 迁徙线
 * @param color Cesium.Color
 * @returns Material
 */
const migrationLineMaterial = (color: Cesium.Color) => {
    return new Cesium.Material({
        fabric: {
            uniforms: {
                color: color,
                percentage: 0.5, // 尾迹百分比
                offset: 0.0,
            },
            source: `
            uniform vec4 color;
            uniform float percentage;
            uniform float offset;
            czm_material czm_getMaterial(czm_materialInput materialInput)
            {
                czm_material material = czm_getDefaultMaterial(materialInput);
                float s = materialInput.s;
                float offset = mod(offset,1.0);
                material.diffuse = color.rgb;
                if((percentage + offset)<=1.0){
                    if(s > percentage + offset || s < offset){
                        material.alpha = 0.0;
                    }
                    else{
                        material.alpha = (s-offset)/percentage;
                    }
                }
                else{
                    if(s>offset){
                        material.alpha = (s-offset)/percentage;
                    }
                    else if(s <= percentage + offset - 1.0){
                        material.alpha = (1.0+s-offset)/percentage;
                    }
                    else{
                        material.alpha = 0.0;
                    }
                }
                return material;
            }`,
        },
    })
}
export default migrationLineMaterial