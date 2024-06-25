import { WebMercatorProjection, WebMercatorTilingScheme, Math, Cartographic, Cartesian2 } from 'cesium';
import CoordTransform from './CoordTransform';

class AmapMercatorTilingScheme extends WebMercatorTilingScheme {
  // _projection;

  constructor() {
    super();

    let projection = new WebMercatorProjection();

    this._projection.project = function (cartographic, result) {
      result = CoordTransform.WGS84ToGCJ02(
        Math.toDegrees(cartographic.longitude),
        Math.toDegrees(cartographic.latitude)
      );
      result = projection.project(new Cartographic(Math.toRadians(result[0]), Math.toRadians(result[1])));
      return new Cartesian2(result.x, result.y);
    };

    this._projection.unproject = function (cartesian, result) {
      let cartographic = projection.unproject(cartesian);
      result = CoordTransform.GCJ02ToWGS84(
        Math.toDegrees(cartographic.longitude),
        Math.toDegrees(cartographic.latitude)
      );
      return new Cartographic(Math.toRadians(result[0]), Math.toRadians(result[1]));
    };
  }
}

export default AmapMercatorTilingScheme;
