import { Color, defined, Event, Material, Property } from 'cesium';

/* 飞线材质类 */
class PolylineTrailLinkMaterialProperty {
  private readonly _definitionChanged: Event;
  private _color?: Color;
  private readonly image: string | undefined;
  private readonly duration: number;
  private _time: number;

  constructor(image: string | undefined, color: Color = Color.WHITE, duration: number = 1000) {
    this._definitionChanged = new Event();
    this._color = color;
    this.duration = duration;
    this._time = new Date().getTime();
    this.image = image;

    (Material as any)._materialCache.addMaterial('PolylineTrailLink', {
      fabric: {
        type: 'PolylineTrailLink',
        uniforms: {
          color: color.withAlpha(1.0),
          image: image,
          time: 0,
        },
        source: `
        czm_material czm_getMaterial(czm_materialInput materialInput) {
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 st = materialInput.st;
          vec4 sampledColor = texture(image, vec2(fract(3.0*st.s - time), st.t));
          material.alpha = sampledColor.a * color.a;
          material.diffuse = (sampledColor.rgb + color.rgb) / 2.0;
          return material;
        }`,
      },
      translucent: () => true,
    });
  }

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  getType(_: any): string {
    return 'PolylineTrailLink';
  }

  getValue(time: any, result: { color?: Color; image?: string; time: number }): any {
    if (!defined(result)) {
      result = {
        time:0
      };
    }

    // result.color = Property.getValueOrClonedDefault(this._color, time, Color.WHITE, result.color);
    result.color = this._color || Color.WHITE;
    result.image = this.image;
    result.time = (new Date().getTime() - this._time) % this.duration / this.duration;

    return result;
  }

  equals(other: PolylineTrailLinkMaterialProperty): boolean {
    // return this === other || Property.equals(this._color, other._color);
    return this === other || (this._color && other._color && this._color.equals(other._color));
  }
}

export default PolylineTrailLinkMaterialProperty