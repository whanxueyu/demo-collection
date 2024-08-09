/**
 * 地球坐标（WGS-84）、火星坐标（GCJ-02）和百度坐标（BD-09）等坐标系之间的转换
 */

// 定义一些常量
const PI = 3.1415926535897932384626; // 圆周率 π
const x_PI = (3.14159265358979324 * 3000.0) / 180.0;
const a = 6378245.0; // 卫星椭球坐标投影到平面地图坐标系的投影因子
const ee = 0.00669342162296594323; //  椭球的偏心率

/**
 * 纬度转换
 */
const transformLat = (longitude: number, latitude: number) => {
  const lng = +longitude;
  const lat = +latitude;
  let ret =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) *
      2.0) /
    3.0;
  return ret;
};

/**
 * 经度转换
 */
const transformLng = (longitude: number, latitude: number) => {
  const lng = +longitude;
  const lat = +latitude;
  let ret =
    300.0 +
    lng +
    2.0 * lat +
    0.1 * lng * lng +
    0.1 * lng * lat +
    0.1 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((150.0 * Math.sin((lng / 12.0) * PI) +
      300.0 * Math.sin((lng / 30.0) * PI)) *
      2.0) /
    3.0;
  return ret;
};

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param {number} longitude GCJ-02/WGS-84 经度
 * @param {number} latitude GCJ-02/WGS-84 纬度
 * @returns {boolean} 返回 true or false
 */
const isOutOfChina = (longitude: number, latitude: number) => {
  const lng = +longitude;
  const lat = +latitude;
  // 国内：经度 73.66~135.05，纬度 3.86~53.55
  return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
};

/**
 * BD-09 to GCJ-02 (百度坐标系 转 火星坐标系)
 * @param {number} longitude BD-09 经度
 * @param {number} latitude BD-09 纬度
 * @returns {number[]} 返回 GCJ-02 经纬度数组
 */
export const bdToGcj = (longitude: number, latitude: number) => {
  const lng = +longitude;
  const lat = +latitude;
  const x = lng - 0.0065;
  const y = lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
  const gg_lng = z * Math.cos(theta);
  const gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat];
};

/**
 * GCJ-02 to BD-09 (火星坐标系 转 百度坐标系)
 * @param {number} longitude GCJ-02 经度
 * @param {number} latitude GCJ-02 纬度
 * @returns {number[]} 返回 BD-09 经纬度数组
 */
export const gcjToBd = (longitude: number, latitude: number) => {
  const lng = +longitude;
  const lat = +latitude;
  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
  const bdLng = z * Math.cos(theta) + 0.0065;
  const bdLat = z * Math.sin(theta) + 0.006;
  return [bdLng, bdLat];
};

/**
 * 计算经纬度
 * @param {number} longitude GCJ-02/WGS-84 经度
 * @param {number} latitude GCJ-02/WGS-84 纬度
 * @returns {number[]} 返回经纬度数组
 */
export const getCoord = (longitude: number, latitude: number) => {
  const lng = +longitude;
  const lat = +latitude;
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  let dLat = transformLat(lng - 105.0, lat - 35.0);
  const radlat = (lat / 180.0) * PI;
  let magic = Math.sin(radlat);
  magic = 1 - ee * magic * magic;
  const sqrtmagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
  dLng = (dLng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
  return [dLng, dLat];
};

/**
 * WGS-84 to GCJ-02 (地球坐标 转 火星坐标系)
 * @param {number} longitude WGS-84 经度
 * @param {number} latitude WGS-84 纬度
 * @returns {number[]} 返回 GCJ-02 经纬度数组
 */
export const wgsToGcj = (longitude: number, latitude: number) => {
  const lng = +longitude;
  const lat = +latitude;
  if (isOutOfChina(lng, lat)) {
    return [lng, lat];
  } else {
    const [dLng, dLat] = getCoord(lng, lat);
    return [lng + dLng, lat + dLat];
  }
};

/**
 * GCJ-02 to WGS-84 (火星坐标系 转 地球坐标)
 * @param {number} longitude GCJ-02 经度
 * @param {number} latitude GCJ-02 纬度
 * @returns {number[]} 返回 WGS-84 经纬度数组
 */
export const gcjToWgs = (longitude: number, latitude: number) => {
  const lng = +longitude;
  const lat = +latitude;
  if (isOutOfChina(lng, lat)) {
    return [lng, lat];
  } else {
    const [dLng, dLat] = getCoord(lng, lat);
    return [lng - dLng, lat - dLat];
  }
};

/**
 * BD-09 to WGS-84 (百度坐标系 转 地球坐标)
 * @param {number} longitude BD-09 经度
 * @param {number} latitude BD-09 纬度
 * @returns {number[]} 返回 WGS-84 经纬度数组
 */
export const bdToWgs = (longitude: number, latitude: number) => {
  const lng = +longitude;
  const lat = +latitude;
  const [gcjLng, gcjLat] = bdToGcj(lng, lat);
  return gcjToWgs(gcjLng, gcjLat);
};

/**
 * WGS-84 to BD-09 (地球坐标 转 百度坐标系)
 * @param {number} longitude WGS-84 经度
 * @param {number} latitude WGS-84 纬度
 * @returns {number[]} 返回 BD-09 经纬度数组
 */
export const wgsToBd = (longitude: number, latitude: number) => {
  const lng = +longitude;
  const lat = +latitude;
  const [gcjLng, gcjLat] = wgsToGcj(lng, lat);
  return gcjToBd(gcjLng, gcjLat);
};

/**
 * WGS-84 to Web mercator (地球坐标 转 墨卡托坐标)
 * @param {number} longitude WGS-84 经度
 * @param {number} latitude WGS-84 纬度
 * @return {number[]}  返回 墨卡托 经纬度数组
 */
export const wgsToMercator = (longitude: number, latitude: number) => {
  const lng = +longitude;
  const lat = +latitude;
  const x = (lng * 20037508.34) / 180;
  let y = Math.log(Math.tan(((90 + lat) * PI) / 360)) / (PI / 180);
  y = (y * 20037508.34) / 180;
  return [x, y];
  /*
    if ((Math.abs(wgsLng) > 180 || Math.abs(wgsLat) > 90))
        return null;
    var x = 6378137.0 * wgsLng * 0.017453292519943295;
    var a = wgsLat * 0.017453292519943295;
    var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
    return {'lat' : y, 'lng' : x};
    //*/
};

/**
 * Web mercator to WGS-84 (墨卡托坐标 转 地球坐标)
 * @param  {number} longitude 墨卡托经度
 * @param  {number} latitude 墨卡托纬度
 * @return {number[]}       返回 WGS-84 经纬度数组
 */
export const mercatorToWgs = (longitude: number, latitude: number) => {
  const lng = +longitude;
  const lat = +latitude;
  const x = (lng / 20037508.34) * 180;
  let y = (lat / 20037508.34) * 180;
  y = (180 / PI) * (2 * Math.atan(Math.exp((y * PI) / 180)) - PI / 2);
  return [x, y];
  /*
    if (Math.abs(lng) < 180 && Math.abs(lat) < 90)
        return null;
    if ((Math.abs(lng) > 20037508.3427892) || (Math.abs(lat) > 20037508.3427892))
        return null;
    var a = lng / 6378137.0 * 57.295779513082323;
    var x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0);
    var y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * lat) / 6378137.0)))) * 57.295779513082323;
    return {'lat' : y, 'lng' : x};
    //*/
};

/**
 * 两点之间的距离
 * @param  {number[]} coordA 起点经纬度
 * @param  {number[]} coordB 终点经纬度
 * @return {number}  返回距离(米)
 */
export const getDistance = (coordA: number[], coordB: number[]) => {
  const [lngA, latA] = coordA;
  const [lngB, latB] = coordB;
  const earthR = 6371000;
  const x =
    Math.cos((latA * PI) / 180) *
    Math.cos((latB * PI) / 180) *
    Math.cos(((lngA - lngB) * PI) / 180);
  const y = Math.sin((latA * PI) / 180) * Math.sin((latB * PI) / 180);
  let s = x + y;
  if (s > 1) s = 1;
  if (s < -1) s = -1;
  const alpha = Math.acos(s);
  const distance = alpha * earthR;
  return distance;
};

export default {
  bdToGcj: bdToGcj,
  gcjToBd: gcjToBd,
  wgsToGcj: wgsToGcj,
  gcjToWgs: gcjToWgs,
  bdToWgs: bdToWgs,
  wgsToBd: wgsToBd,
  wgsToMercator: wgsToMercator,
  mercatorToWgs: mercatorToWgs,
  getDistance: getDistance,
};