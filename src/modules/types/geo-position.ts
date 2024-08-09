import { Cartesian3, Ellipsoid, Math } from "cesium";
/**
 * 采用Cesium.Cartographic
 */
export class GeoPositon {
  private _lng;
  private _lat;
  private _alt;
  constructor(lng?: number, lat?: number, alt?: number) {
    this._lng = lng ?? 0;
    this._lat = lat ?? 0;
    this._alt = alt ?? 0;
  }

  set lng(val: number) {
    this._lng = val;
  }

  get lng() {
    return this._lng;
  }

  set lat(val: number) {
    this._lat = val;
  }

  get lat() {
    return this._lat;
  }

  set alt(val: number) {
    this._alt = val;
  }

  get alt() {
    return this._alt;
  }

  valid(): boolean {
    if (Number.isNaN(this.lng) || Number.isNaN(this.lat)) return false;
    return true;
  }

  /**
   *
   * @returns {string}
   */
  serialize(): string {
    let position = new GeoPositon(this._lng, this._lat, this._alt);
    return JSON.stringify(position);
  }

  clone(): GeoPositon {
    let position = new GeoPositon(this._lng, this._lat, this._alt);
    return position;
  }

  copy(): GeoPositon {
    return this.clone();
  }

  toCartesian3(): Cartesian3 {
    return Cartesian3.fromDegrees(this.lng, this.lat, this.alt);
  }

  static add(left: GeoPositon, right: GeoPositon): GeoPositon {
    return new GeoPositon(
      left.lng + right.lng,
      left.lat + right.lat,
      left.alt + right.alt
    );
  }

  static subtract(left: GeoPositon, right: GeoPositon): GeoPositon {
    return new GeoPositon(
      left.lng - right.lng,
      left.lat - right.lat,
      left.alt - right.alt
    );
  }

  static midpoint(left: GeoPositon, right: GeoPositon): GeoPositon {
    const left_c = Cartesian3.fromDegrees(
      left.lng,
      left.lat,
      left.alt,
      Ellipsoid.WGS84
    );
    const right_c = Cartesian3.fromDegrees(
      right.lng,
      right.lat,
      right.alt,
      Ellipsoid.WGS84
    );
    const mid_c = new Cartesian3();
    Cartesian3.midpoint(left_c, right_c, mid_c);
    let cartographic = Ellipsoid.WGS84.cartesianToCartographic(mid_c);
    return new GeoPositon(
      Math.toDegrees(cartographic?.longitude || 0),
      Math.toDegrees(cartographic?.latitude || 0),
      cartographic.height || 0
    );
  }

  static midpoint_cartesian(left: GeoPositon, right: GeoPositon): Cartesian3 {
    const left_c = Cartesian3.fromDegrees(
      left.lng,
      left.lat,
      left.alt,
      Ellipsoid.WGS84
    );
    const right_c = Cartesian3.fromDegrees(
      right.lng,
      right.lat,
      right.alt,
      Ellipsoid.WGS84
    );
    const mid_c = new Cartesian3();
    return Cartesian3.midpoint(left_c, right_c, mid_c);
  }

  
}