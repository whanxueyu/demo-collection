import * as Cesium from 'cesium';
/**
 * 贴地雷达扫描材质
 * @param color Cesium.Color
 * @returns Material
 */
const radaeScanMaterial = (color: Cesium.Color) => {
  return new Cesium.Material({
    translucent: false,
    fabric: {
      uniforms: {
        color: color,
        rotate: 90.0,
        percent: 0.3,
      },
      source: `
          uniform vec4 color;
          uniform float percent;
          
          float get_angle(vec2 base,vec2 dir)
          { 
            base = normalize(base);
            dir = normalize(dir);
            float angle = degrees(acos(abs(dot(dir,base))));
            if (dir.s > 0.0 && dir.t > 0.0){angle = angle;}
            else if (dir.s < 0.0 && dir.t > 0.0){angle = 180.0 - angle;}
            else if (dir.s < 0.0 && dir.t < 0.0){angle = 180.0 + angle;}
            else{angle = 360.0 - angle;}
            return angle;
          }

          czm_material czm_getMaterial(czm_materialInput materialInput)
          {
            czm_material material = czm_getDefaultMaterial(materialInput);
            material.diffuse = czm_gammaCorrect(color.rgb); 

            vec2 st = materialInput.st;
            vec2 base = vec2(0.5,0.0);
            vec2 dir = st-vec2(0.5,0.5);
            float len = length(dir);
            if(len > 0.495){
              material.alpha = 0.8;
              material.diffuse = czm_gammaCorrect(color.rgb);
              material.emission=vec3(0.2);
            }
            else{
              float angle = get_angle(base,dir);
              material.alpha = (mod(angle + (-czm_frameNumber),360.0)-(1.0-percent)*360.0)/(360.0*percent);
              material.emission=vec3(0.5);
            } 
            return material;
          }
          `,
    },
  })
}

export default radaeScanMaterial