let getTimestamp

if (typeof performance !== 'undefined' && typeof performance.now === 'function' && isFinite(performance.now())) {
    getTimestamp = function () {
        return performance.now()
    }
} else {
    getTimestamp = function () {
        return Date.now()
    }
}

class GetFPSInfo {
    _lastFpsSampleTime: number;
    _lastMsSampleTime: number;
    _fpsFrameCount: number;
    _msFrameCount: number;
    fps: number | string = 'N/A';
    ms: number | string = 'N/A';
    constructor() {
        this._lastFpsSampleTime = getTimestamp()
        this._lastMsSampleTime = getTimestamp()
        this._fpsFrameCount = 0
        this._msFrameCount = 0
    }

    update() {
        let time = getTimestamp()
        this._fpsFrameCount++
        let updateDisplay = true
        let fpsElapsedTime = time - this._lastFpsSampleTime
        if (fpsElapsedTime > 1000) {
            if (updateDisplay) {
                this.fps = ((this._fpsFrameCount * 1000) / fpsElapsedTime) | 0
            }

            this._lastFpsSampleTime = time
            this._fpsFrameCount = 0
        }
        this._msFrameCount++
        let msElapsedTime = time - this._lastMsSampleTime
        if (msElapsedTime > 200) {
            if (updateDisplay) {
                this.ms = (msElapsedTime / this._msFrameCount).toFixed(2)
            }
            this._lastMsSampleTime = time
            this._msFrameCount = 0
        }
        return {
            fps: this.fps,
            ms: this.ms
        }
    }
}

export default GetFPSInfo
