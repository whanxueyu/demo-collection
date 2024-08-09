import { GeoPositon } from "../types/geo-position";
import {
  Cartesian3,
  Cartographic,
  Ellipsoid,
  Math,
  WebMercatorProjection as WebMercator,
} from "cesium";

const WebMercatorProjection = new WebMercator();
const HALF_PI = Math.PI / 2;

class GraphTransform {
  /**
   * number[]转换到Cartesian3[]
   * @param positions
   * @returns
   */
  static ToCartesian3(positions: number[] | undefined): Cartesian3[] {
    const _positions: Cartesian3[] = [];
    if (positions == undefined) return _positions;

    if (positions && positions.length >= 3) {
      const lenth = positions.length;

      for (let i = 0; i < lenth; i += 3) {
        _positions.push(
          Cartesian3.fromDegrees(
            positions[i],
            positions[i + 1],
            positions[i + 2]
          )
        );
      }
    }
    return _positions;
  }

  static ToNum(positions: Cartesian3[] | undefined): number[] {
    const _positions: number[] = [];
    if (positions == undefined) return _positions;

    for (let position of positions) {
      _positions.push(position.x);
      _positions.push(position.y);
      _positions.push(position.z);
    }
    return _positions;
  }
  /**
   * Transforms Cartesian To WGS84
   * @param cartesian
   * @returns {GeoPositon}
   */
  static transformCartesianToWGS84(cartesian: Cartesian3): GeoPositon {
    if (cartesian) {
      let cartographic = Ellipsoid.WGS84.cartesianToCartographic(cartesian);
      return new GeoPositon(
        Math.toDegrees(cartographic?.longitude || 0),
        Math.toDegrees(cartographic?.latitude || 0),
        cartographic.height || 0
      );
    }
    return new GeoPositon(0, 0, 0);
  }

  /**
   * Transforms WGS84 To Cartesian
   * @param position
   * @returns {Cartesian3}
   */
  static transformWGS84ToCartesian(position: GeoPositon) {
    if (!position.valid()) return Cartesian3.ZERO;
    return position
      ? Cartesian3.fromDegrees(
          position.lng,
          position.lat,
          position.alt,
          Ellipsoid.WGS84
        )
      : Cartesian3.ZERO;
  }

  /**
   * Transforms WGS84 To Cartographic
   * @param position
   * @returns {Cartographic}
   */
  static transformWGS84ToCartographic(position: GeoPositon) {
    return position
      ? Cartographic.fromDegrees(position.lng, position.lat, position.alt)
      : Cartographic.ZERO;
  }

  /**
   * Transforms Cartesian Array To WGS84 Array
   * @param cartesianArr
   * @returns {*|*[]}
   */
  static transformCartesianArrayToWGS84Array(
    cartesianArr: Cartesian3[]
  ): GeoPositon[] {
    return cartesianArr
      ? cartesianArr.map((item) => this.transformCartesianToWGS84(item))
      : [];
  }

  /**
   * Transforms WGS84 Array To Cartesian Array
   * @param WGS84Arr
   * @returns {*|*[]}
   */
  static transformWGS84ArrayToCartesianArray(
    WGS84Arr: GeoPositon[],offset?:GeoPositon
  ): Cartesian3[] {
    if(offset)
    {
      return WGS84Arr
      ? WGS84Arr.map((item) => this.transformWGS84ToCartesian(GeoPositon.add(item,offset)))
      : [];
    }
    return WGS84Arr
      ? WGS84Arr.map((item) => this.transformWGS84ToCartesian(item))
      : [];
  }

  /**
   * Transforms WGS84 To Mercator
   * @param position
   * @returns {Position}
   */
  static transformWGS84ToMercator(position: GeoPositon) {
    let mp = WebMercatorProjection.project(
      Cartographic.fromDegrees(position.lng, position.lat, position.alt)
    );
    return new GeoPositon(mp.x, mp.y, mp.z);
  }

  /**
   * Transforms Mercator To WGS84
   * @param position
   * @returns {Position}
   */
  static transformMercatorToWGS84(position: GeoPositon) {
    let mp = WebMercatorProjection.unproject(
      new Cartesian3(position.lng, position.lat, position.alt)
    );
    return new GeoPositon(
      Math.toDegrees(mp.longitude),
      Math.toDegrees(mp.latitude),
      mp.height
    );
  }
}

export { GraphTransform, WebMercatorProjection, HALF_PI };
