
import * as Cesium from 'cesium';

/***
 * entity.polyline.material = new Cesium.SpriteLineMaterialProperty({
            color: Cesium.Color.AQUA,
            speed: 10.0
          })
 */
export default class SpriteLineMaterialProperty extends Cesium.Material {
  // private _definitionChanged: Cesium.Event;
  // private _color: Cesium.Color | undefined;
  // private _speed: number | undefined;
  constructor(options) {
    super();
    this._definitionChanged = new Cesium.Event();
    this._color = options.color;
    this._speed = options.speed;
  }
  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }
  // eslint-disable-next-line
  getType(time) {
    return Cesium.Material.SpriteLineMaterialType;
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }
    result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
    result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 10, result.speed);
    return result;
  }

  equals(other) {
    return (this === other ||
      (other instanceof SpriteLineMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed)))
  }
}
Object.defineProperties(SpriteLineMaterialProperty.prototype, {
  speed: Cesium.createPropertyDescriptor('speed'),
  color: Cesium.createPropertyDescriptor('color')
})
Cesium.SpriteLineMaterialProperty = SpriteLineMaterialProperty
Cesium.Material.SpriteLineMaterialType = 'SpriteLineMaterialType';
Cesium.Material.SpriteLineMaterialSource = `
    uniform vec4 color;  
    const float pi = 3.1415926;
    czm_material czm_getMaterial(czm_materialInput materialInput)
    {
      czm_material material = czm_getDefaultMaterial(materialInput);
      float time = fract( czm_frameNumber * speed / 1000.0);
      vec2 st = materialInput.st;
      material.diffuse = color.rgb;
      material.alpha = 1.0 - fract(st.s * 2.0 + time);
      return material;
    }
    `
Cesium.Material._materialCache.addMaterial(Cesium.Material.SpriteLineMaterialType, {
  fabric: {
    type: Cesium.Material.SpriteLineMaterialType,
    uniforms: {
      color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
      speed: 5.0
    },
    source: Cesium.Material.SpriteLineMaterialSource
  },
  // eslint-disable-next-line
  translucent: function (material) {
    return true;
  }
})