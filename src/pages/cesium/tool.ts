import * as turf from "@turf/turf";
export const calculateRadius = (num: number, gap: number) => {
    // 计算圆周上的总路径长度
    const circumference = num * gap;

    // 根据圆周长公式计算半径
    const radius = circumference / (2 * Math.PI);

    return radius;
}

export const getCirclePosition = (target: { longitude: number, latitude: number }, step: number, total) => {
    let radius = calculateRadius(total, step)
    var center = [target.longitude, target.latitude];
    var options = { steps: total };
    let turfCircle =  turf.circle(center, radius / 1000, options);
    return turfCircle.geometry.coordinates[0]
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
export function distributeRect(totalNumber, layerNumber) {
    // 计算每行的基础数量
    const baseCount = Math.ceil(totalNumber / layerNumber);
    // 计算剩余的数量
    const remainder = totalNumber - baseCount * layerNumber;

    // 创建结果数组
    const result = [];

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
}, layerNumber: number, total: number, distance: number) {
    let result = distributeRect(total, layerNumber)
    let n = result[0]

    // 1. 根据中心点计算矩阵原点
    var point = turf.point([target.longitude, target.latitude]);
    let point1 = turf.destination(point, (distance * (layerNumber - 1) / 2000), 90);
    let point2 = turf.destination(point1, (distance * (n - 1) / 2000), 0);
    const matrix = [];

    for (var i = 0; i < layerNumber; i++) {
        var point3 = turf.destination(point2, (distance * i / 1000), -90);
        // matrix.push(point3.geometry.coordinates);
        for (var j = 0; j < n; j++) {
            var point4 = turf.destination(point3, (distance * j / 1000), 180);
            matrix.push(point4.geometry.coordinates);
        }
    }
    return matrix;
}

type ThrottleOrDebounceFunction<T extends (...args: any[]) => any> = T & {
  cancel?: () => void;
  flush?: () => void;
};
// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ThrottleOrDebounceFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;

  const throttled = function(this: any, ...args: Parameters<T>): void {
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

  throttled.cancel = function(): void {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return throttled as ThrottleOrDebounceFunction<T>;
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ThrottleOrDebounceFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = function(this: any, ...args: Parameters<T>): void {
    const context = this;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };

  debounced.cancel = function(): void {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  debounced.flush = function(): void {
    if (timeout) {
      clearTimeout(timeout);
      func.apply(this);
    }
  };

  return debounced as ThrottleOrDebounceFunction<T>;
}