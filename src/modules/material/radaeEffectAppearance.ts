import * as Cesium from 'cesium';
/**
 * 椎体雷达扫描材质
 * @param color Cesium.Color
 * @returns appearance  primitive.appearance
 */
const radaeEffectAppearance = (color: Cesium.Color) => {
  return new Cesium.MaterialAppearance({
    // 自定义纹理
    material: new Cesium.Material({
      fabric: {
        // type: "radar",
        uniforms: {
          color: color,
          repeat: 30.0,
          offset: 0.0,
          thickness: 0.2,
        },
        source: `
          uniform vec4 color;
          uniform float repeat;
          uniform float offset;
          uniform float thickness;
          czm_material czm_getMaterial(czm_materialInput materialInput)
          {
            czm_material material = czm_getDefaultMaterial(materialInput);
            float sp = 1.0/repeat;
            vec2 st = materialInput.st;
            float dis = distance(st, vec2(0.5));
            float m = mod(dis + offset, sp);
            float a = step(sp*(1.0-thickness), m);
            material.diffuse = color.rgb;
            material.alpha = a * color.a;
            vec3 normalMC = material.normal;
            if(normalMC.y < 0.0 && normalMC.z < 0.0)
            { 
              discard;
            }
            return material;
          }`,
      },
      translucent: true,
    }),
    faceForward: false, // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，从而避免法向计算后发黑等问题
    closed: true, // 是否为封闭体，实际上执行的是是否进行背面裁剪
    vertexShaderSource: `
      attribute vec3 position3DHigh;
      attribute vec3 position3DLow;
      attribute vec3 normal;
      attribute vec2 st;
      attribute float batchId;

      varying vec3 v_positionEC;
      varying vec3 v_normalEC;
      varying vec2 v_st;

      void main()
      {
        vec4 p = czm_computePosition();

        v_positionEC = (czm_modelViewRelativeToEye * p).xyz;      // position in eye coordinates
        v_normalEC =  normal;                         // normal in world coordinates
        v_st = st;

        gl_Position = czm_modelViewProjectionRelativeToEye * p;
      }`,
  })
}
export default radaeEffectAppearance