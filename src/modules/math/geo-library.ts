import { GeoPositon } from "../types/geo-position";

const HALF_PI = Math.PI / 2;
const TWO_PI = Math.PI * 2;
const FITTING_COUNT = 100;
const ZERO_TOLERANCE = 0.0001;

class GeoMathLibrary {
  /**
   * 只用于计算2D经纬度的距离坐标计算，非地球真实距离
   * @extends 如果希望计算两点的真实距离，用distance
   * @param pnt1
   * @param pnt2
   * @returns
   */
  static distance_geo(pnt1: GeoPositon, pnt2: GeoPositon): number {
    return Math.sqrt(
      Math.pow(pnt1.lng - pnt2.lng, 2) + Math.pow(pnt1.lat - pnt2.lat, 2)
    );
  }

  /**
   * 只用于计算2D经纬度的整体距离坐标计算，非地球真实距离
   * @param points
   * @returns
   */
  static wholeDistance_geo(points: GeoPositon[]): number {
    let distance = 0;
    for (let i = 0; i < points.length - 1; i++)
      distance += this.distance_geo(points[i], points[i + 1]);
    return distance;
  }

  static getBaseLength_geo(points: GeoPositon[]): number {
    return Math.pow(this.wholeDistance_geo(points), 0.99);
  }

  static mid_geo(pnt1: GeoPositon, pnt2: GeoPositon): GeoPositon {
    return new GeoPositon(
      (pnt1.lng + pnt2.lng) / 2,
      (pnt1.lat + pnt2.lat) / 2,
      0
    );
  }

  static isClockWise_geo(
    pnt1: GeoPositon,
    pnt2: GeoPositon,
    pnt3: GeoPositon
  ): boolean {
    return (
      (pnt3.lat - pnt1.lat) * (pnt2.lng - pnt1.lng) >
      (pnt2.lat - pnt1.lat) * (pnt3.lng - pnt1.lng)
    );
  }

  static getAzimuth_geo(startPnt: GeoPositon, endPnt: GeoPositon): number {
    let azimuth: number = 0;
    let angle = Math.asin(
      Math.abs(endPnt.lat - startPnt.lat) / this.distance_geo(startPnt, endPnt)
    );
    if (endPnt.lat >= startPnt.lat && endPnt.lng >= startPnt.lng)
      azimuth = angle + Math.PI;
    else if (endPnt.lat >= startPnt.lat && endPnt.lng < startPnt.lng)
      azimuth = TWO_PI - angle;
    else if (endPnt.lat < startPnt.lat && endPnt.lng < startPnt.lng)
      azimuth = angle;
    else if (endPnt.lat < startPnt.lat && endPnt.lng >= startPnt.lng)
      azimuth = Math.PI - angle;
    return azimuth;
  }

  static getAngleOfThreePoints_geo(
    pntA: GeoPositon,
    pntB: GeoPositon,
    pntC: GeoPositon
  ) {
    let angle =
      this.getAzimuth_geo(pntB, pntA) - this.getAzimuth_geo(pntB, pntC);
    return angle < 0 ? angle + TWO_PI : angle;
  }

  static getThirdPoint_geo(
    startPnt: GeoPositon,
    endPnt: GeoPositon,
    angle: number,
    distance: number,
    clockWise: boolean
  ) {
    let azimuth = this.getAzimuth_geo(startPnt, endPnt);
    let alpha = clockWise ? azimuth + angle : azimuth - angle;
    let dx = distance * Math.cos(alpha);
    let dy = distance * Math.sin(alpha);
    return new GeoPositon(endPnt.lng + dx, endPnt.lat + dy);
  }

  static getArcPoints_geo(
    center: GeoPositon,
    radius: number,
    startAngle: number,
    endAngle: number
  ): GeoPositon[] {
    let x: number,
      y: number,
      pnts: GeoPositon[] = [];
    let angleDiff = endAngle - startAngle;
    angleDiff = angleDiff < 0 ? angleDiff + TWO_PI : angleDiff;
    for (let i = 0; i <= FITTING_COUNT; i++) {
      let angle = startAngle + (angleDiff * i) / FITTING_COUNT;
      x = center.lng + radius * Math.cos(angle);
      y = center.lat + radius * Math.sin(angle);
      pnts.push(new GeoPositon(x, y));
    }
    return pnts;
  }

  static getBinomialFactor(n: number, index: number) {
    return (
      this.getFactorial(n) /
      (this.getFactorial(index) * this.getFactorial(n - index))
    );
  }

  static getBezierPoints(points: GeoPositon[]) {
    if (points.length <= 2) return points;
    let bezierPoints: GeoPositon[] = [];
    let n = points.length - 1;
    for (let t = 0; t <= 1; t += 0.01) {
      let x = 0;
      let y = 0;
      for (let index = 0; index <= n; index++) {
        let factor = this.getBinomialFactor(n, index);
        let a = Math.pow(t, index);
        let b = Math.pow(1 - t, n - index);
        x += factor * a * b * points[index].lng;
        y += factor * a * b * points[index].lat;
      }
      bezierPoints.push(new GeoPositon(x, y));
    }
    bezierPoints.push(points[n]);
    return bezierPoints;
  }

  static getFactorial(n: number) {
    if (n <= 1) return 1;
    if (n === 2) return 2;
    if (n === 3) return 6;
    if (n === 4) return 24;
    if (n === 5) return 120;
    let result = 1;
    for (let i = 1; i <= n; i++) result *= i;
    return result;
  }
}

export { GeoMathLibrary, GeoPositon, HALF_PI, TWO_PI, ZERO_TOLERANCE };
