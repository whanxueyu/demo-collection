import * as turf from "@turf/turf";
export const calculateRadius = (num: number, gap: number) => {
    // 计算圆周上的总路径长度
    const circumference = num * gap;

    // 根据圆周长公式计算半径
    const radius = circumference / (2 * Math.PI);

    return radius;
}

export const getCirclePosition = (target: { longitude: number, latitude: number }, step: number, total: number, num: number, bearing: number) => {
    let devideArr = devideLayer(total, num)
    let coordinates = []
    devideArr.forEach(item => {
        let radius = calculateRadius(item, step)
        var center = [target.longitude, target.latitude];
        var options = { steps: item };
        let turfCircle = turf.circle(center, radius / 1000, options);
        let indexCoordinates = turfCircle.geometry.coordinates[0];
        coordinates = coordinates.concat(indexCoordinates)
    })
    return coordinates
}

const devideLayer = (total: number, num: number) => {
    let avager = Math.ceil(total / num)
    let middle = 0
    if (num % 2 == 0) {
        middle = num / 2
        let arr: number[] = handleEven(total, num, middle, avager)
        return arr
    } else {
        middle = num / 2 + 0.5
        let arr: number[] = handleOdd(total, num, middle, avager)
        return arr
    }
}
const handleOdd = (total: number, num: number, middle: number, avager: number) => {
    let arr = []
    for (var i = num; i > 0; i--) {
        let indexNum = avager + (i - middle) * 3
        if (indexNum > 3)
            arr.push(indexNum)
    }
    return arr
}
const handleEven = (total: number, num: number, middle: number, avager: number) => {
    let arr = []
    for (var i = num; i > 0; i--) {
        let indexNum = avager + (i - middle) * 3
        if (indexNum > 3)
            arr.push(indexNum)
    }
    return arr
}

export const distributeElements = (Sn: number, N: number,) => {
    const d = 3; // 公差
    // 计算第一项 a1
    let a1 = (2 * Sn / N - (N - 1) * d) / 2;
    // 如果 a1 不是整数，则返回一个提示
    if (!Number.isInteger(a1)) {
        console.log(a1);
        // return '第一项不是整数，请检查输入值';
        a1 = Math.floor(a1)
    }
    // 计算每一项
    const sequence = [];
    for (let i = 0; i < N; i++) {
        sequence.push(a1 + i * d);
    }
    return sequence;
}
/**
 * 计算每行最少数量
 * @param n 行数
 * @returns 每行最少数量
 */
export const calculateNthTerm = (n: number): number => {
    const a1 = 4; // 首项
    const d = 3; // 公差
    const an = a1 + (n - 1) * d;
    return an;
}

/**
 * 计算行数为n时的最小数量
 * @param n 行数
 * @returns 
 */

export const calculateSum = (n: number): number => {
    const a1 = 4; // 首项
    const d = 3; // 公差
    const Sn = (n / 2) * (2 * a1 + (n - 1) * d);
    return Sn;
}

export const calculateN = (total: number): number => {
    const a = 3;
    const b = 5;
    const c = -2 * total;

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
        throw new Error("No real solution exists.");
    }

    const n = (-b + Math.sqrt(discriminant)) / (2 * a);

    // 确保n是正整数
    if (n <= 0 || !Number.isInteger(n)) {
        throw new Error("Invalid total or no valid solution.");
    }

    return n;
}
export function distributeRect(totalNumber: number, layerNumber: number) {
    // 计算每行的基础数量
    const baseCount = Math.ceil(totalNumber / layerNumber);
    // 计算剩余的数量
    const remainder = totalNumber - baseCount * layerNumber;

    // 创建结果数组
    const result: number[] = [];

    // 分配基础数量
    for (let i = 0; i < layerNumber - 1; i++) {
        result.push(baseCount);
    }

    // 最后一行使用剩余的数量
    if (baseCount + remainder < 0) {
        result.pop()
        result.push(baseCount + baseCount + remainder)
        result.push(0)
    } else {
        result.push(baseCount + remainder);
    }

    return result;
}
export function getRectPosition(target: {
    longitude: number;
    latitude: number;
}, layerNumber: number, total: number, distance: number, bearing: number, isVertical: boolean) {
    let result = distributeRect(total, layerNumber)
    let n = result[0]
    let pn1 = isVertical ? (layerNumber - 1) : (n - 1)
    let pn2 = isVertical ? (n - 1) : (layerNumber - 1)

    // 1. 根据中心点计算矩阵原点
    var point = turf.point([target.longitude, target.latitude]);
    let point1 = turf.destination(point, (distance * pn1 / 2000), isVertical ? 90 : 270);
    let point2 = turf.destination(point1, (distance * pn2 / 2000), 0);
    const matrix = [];
    let angle1 = isVertical ? 270 : 180
    let angle2 = isVertical ? 180 : 90

    for (var i = 0; i < layerNumber; i++) {
        var point3 = turf.destination(point2, (distance * i / 1000), angle1);
        // matrix.push(point3.geometry.coordinates);
        for (var j = 0; j < n; j++) {
            var point4 = turf.destination(point3, (distance * j / 1000), angle2);
            var options = { pivot: [target.longitude, target.latitude] };
            var rotatedPoly = turf.transformRotate(point4, bearing, options);
            matrix.push(rotatedPoly.geometry.coordinates);
        }
    }
    return matrix;
}


export const getWedgePosition = (target: {
    longitude: number;
    latitude: number;
}, angle: number, layerNumber: number, total: number, distance: number, bearing: number) => {
    // 1. 根据中心点计算矩阵原点
    var point = turf.point([target.longitude, target.latitude]);

    var hypotenuse = calculateHypotenuse(distance, angle / 2);
    var otherLength = calculateOtherLeg(distance, angle / 2);
    var desPer = otherLength / distance

    var layerArr = caculateTest(total, layerNumber, desPer)
    console.log(layerArr)
    var leftOrigin = turf.destination(point, (distance / 3000), -90);
    var rightOrigin = turf.destination(point, (distance / 3000), 90);
    let wedge = []
    for (var i = 0; i < layerNumber; i++) {
        var leftPoint = null;
        var rightPoint = null;
        if (i == 0) {
            leftPoint = leftOrigin;
            rightPoint = rightOrigin;
        } else {
            leftPoint = turf.destination(leftOrigin, (hypotenuse * i / 1000), 180);
            rightPoint = turf.destination(rightOrigin, (hypotenuse * i / 1000), 180);
        }
        var options = { pivot: [target.longitude, target.latitude] };
        var rotatedLeft = turf.transformRotate(leftPoint, bearing, options);
        var rotatedFight = turf.transformRotate(rightPoint, bearing, options);
        wedge.push(rotatedLeft.geometry.coordinates);
        wedge.push(rotatedFight.geometry.coordinates);

        for (var j = 1; j < layerArr[i] - 1; j++) {
            if (j % 2 === 0) {
                let point1 = turf.destination(rightPoint, (distance * j / 2 / 1000), 180 - angle / 2);
                var rotatedPoint1 = turf.transformRotate(point1, bearing, options);
                wedge.push(rotatedPoint1.geometry.coordinates);

            } else {
                let point1 = turf.destination(leftPoint, (distance * Math.ceil(j / 2) / 1000), angle / 2 + 180);
                var rotatedPoint1 = turf.transformRotate(point1, bearing, options);
                wedge.push(rotatedPoint1.geometry.coordinates);
            }
        }
    }
    return wedge;
}
export const caculateTest = (total: number, layerNumber: number, desPer: number) => {
    let max = (total + (layerNumber - 1) * desPer * 2) / layerNumber
    console.log(max)
    let arr = []
    for (var i = 0; i < layerNumber; i++) {
        let num = Math.round(max - (i * desPer * 2))
        if (num % 2 !== 0) {
            num = num + 1
        }
        arr.push(num)
    }
    let sum = arr.reduce((a, b) => a + b, 0)
    console.log(sum)
    let disValue = total - sum;
    if (disValue % 2 !== 0) {
        for (var i = 0; i < disValue; i++) {
            // 将disValue分配到数组arr中。arr的每一项逐渐+1，知道disvalue全部分配完，剩余为0
            arr[i % layerNumber] += 1;
        }
    } else {
        for (var i = 0; i < disValue; i = i + 2) {
            // 将disValue分配到数组arr中。arr的每一项逐渐+1，知道disvalue全部分配完，剩余为0
            arr[i % layerNumber] += 2;
        }
    }

    return arr
}
function calculateOtherLeg(adSideLength: number, angleInDegrees: number) {
    // 将角度转换为弧度
    const angleRadians = angleInDegrees * (Math.PI / 180);

    // 计算斜边 c 的长度
    const c = adSideLength / Math.sin(angleRadians);

    // 使用勾股定理计算另一条直角边 b 的长度
    const b = Math.sqrt(c * c - adSideLength * adSideLength);

    return b;
}
function calculateHypotenuse(adjacentSideLength: number, angleInDegrees: number) {
    // 将角度从度转换为弧度
    const angleInRadians = angleInDegrees * (Math.PI / 180);
    // 使用正弦函数计算
    const hypotenuseLength = adjacentSideLength / Math.sin(angleInRadians);
    return hypotenuseLength;
}

type ThrottleOrDebounceFunction<T extends (...args: any[]) => any> = T & {
    cancel?: () => void;
    flush?: () => void;
};
// 节流函数--执行第一次
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
): ThrottleOrDebounceFunction<T> {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let previous = 0;

    const throttled = function (this: any, ...args: Parameters<T>): void {
        const context = this;
        const now = Date.now();

        if (now - previous > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            func.apply(context, args);
            previous = now;
        } else if (!timeout) {
            timeout = setTimeout(() => {
                func.apply(context, args);
                previous = now;
            }, wait - (now - previous));
        }
    };

    throttled.cancel = function (): void {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return throttled as ThrottleOrDebounceFunction<T>;
}

// 防抖函数--执行最后一次
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
): ThrottleOrDebounceFunction<T> {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = function (this: any, ...args: Parameters<T>): void {
        const context = this;

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };

    debounced.cancel = function (): void {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    debounced.flush = function (): void {
        if (timeout) {
            clearTimeout(timeout);
            func.apply(this);
        }
    };

    return debounced as ThrottleOrDebounceFunction<T>;
}

export const twoBezier = (t, p1, cp, p2) => {
    const [x1, y1, z1] = p1
    const [cx, cy, cz] = cp
    const [x2, y2, z2] = p2
    let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2
    let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2
    let z = (1 - t) * (1 - t) * z1 + 2 * t * (1 - t) * cz + t * t * z2
    return [x, y, z]
}
/**
 * @desc 贝塞尔曲线
 * @param {Array} p1 起点坐标
 * @param {Array} p2 终点坐标
 */
export const ceratBezierLine = (p1, p2) => {
    const maxHeight = 1000000
    const [x1, y1] = p1
    const [x2, y2] = p2
    const cp = [(x1 + x2) / 2, (y1 + y2) / 2, maxHeight]
    const positions = []
    for (let i = 0; i <= 1; i = i + 0.01) {
        let point = twoBezier(i, [p1, 0].flat(), cp, [p2, 0].flat())
        positions.push(point)
    }
    return positions.flat()
}

export const points = {
    start: { 北京: [116.46, 39.92] },
    end: {
        甘肃: [103.73, 36.03],
        青海: [101.74, 36.56],
        河北: [114.48, 38.03],
        云南: [102.73, 25.04],
        贵州: [106.71, 26.57],
        湖北: [114.31, 30.52],
        河南: [113.65, 34.76],
        山东: [117, 36.65],
        江苏: [118.78, 32.04],
        安徽: [117.27, 31.86],
        浙江: [120.19, 30.26],
        江西: [115.89, 28.68],
        福建: [119.3, 26.08],
        广东: [113.23, 23.16],
        湖南: [113, 28.21],
        海南: [110.35, 20.02],
        辽宁: [123.38, 41.8],
        吉林: [125.35, 43.88],
        黑龙江: [126.63, 45.75],
        山西: [112.53, 37.87],
        陕西: [108.95, 34.27],
        台湾: [121.3, 25.03],
        四川: [104.06, 30.67],
        上海: [121.48, 31.22],
        重庆: [106.54, 29.59],
        天津: [117.2, 39.13],
        内蒙古: [111.65, 40.82],
        广西: [108.33, 22.84],
        西藏: [91.11, 29.97],
        宁夏: [106.27, 38.47],
        新疆: [87.68, 43.77],
        香港: [114.17, 22.28],
        澳门: [113.54, 22.19],
    },
}