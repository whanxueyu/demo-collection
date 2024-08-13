import * as turf from "@turf/turf";
export const calculateRadius = (num: number, gap: number) => {
    // 计算圆周上的总路径长度
    const circumference = num * gap;

    // 根据圆周长公式计算半径
    const radius = circumference / (2 * Math.PI);

    return radius;
}

export const getCirclePosition = (target: { longitude: number, latitude: number }, radius: number,steps) => {
    var center = [target.longitude, target.latitude];
    var options = { steps: steps,};
    return turf.circle(center, radius/1000, options);
}