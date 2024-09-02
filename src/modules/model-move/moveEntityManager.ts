// import * as Cesium from 'cesium';
import { ElMessage } from "element-plus";
import ModelEntity from "./moveEntity"
import StaticEntity from "./staticEntity"
import { useDateFormat } from '@vueuse/core';
import { useEventBus } from "@vueuse/core";
import * as Cesium from 'cesium'
import PolylineTrailLinkMaterialProperty from '@/modules/material/PolylineTrailLinkMaterial'
const selectMoveModel = useEventBus("selectMoveModel");

type Point = {
    longitude: number,
    latitude: number,
    height: number,
}

type TimeEvent = {
    time: string,
    type:string,
    action: (string?: string) => void,
}
/**
 * 定义一个模型移动选项的类型
 * @property {string} modelPath - 模型的路径
 * @property {string} iconPath - 图标的路径
 * @property {number} speed - 移动的速度
 * @property {boolean} [animationLoop=false] - 是否循环动画，默认为false
 * @property {boolean} [showLine=false] - 是否显示路径的线条，默认为false
 * @property {boolean} [showPoint=false] - 是否显示路径拐点，默认为false
 * @property {boolean} [isViewTrack=false] - 是否视角跟随，默认为false
 */
type ModelMoveOption = {
    id: string,
    name: string,
    modelPath: string,
    iconPath: string,
    speed: number,
    showLine?: boolean | string,
    showPoint?: boolean | string,
    isViewTrack?: boolean | string,
    clampGround?: boolean | string,
    startTime?: string,
    enableScan?: boolean | string,
    scanRadius?: number,
    modelType?: string,
    camp?: string,
}
type ModelStaticOption = {
    id: string,
    name: string,
    type: string,
    modelPath: string,
    position: Point,
    iconPath: string,
    clampGround?: boolean | string,
}
class ModelManager {
    private viewer: Cesium.Viewer;
    private animationLoop?: boolean;
    private models: Map<string, ModelEntity>;
    private staticModels: Map<string, StaticEntity>;
    public startTime: Cesium.JulianDate;
    public stopTime: Cesium.JulianDate;
    private timeEventList: TimeEvent[];
    protected tempEvents: TimeEvent[];
    private clickHandler: Cesium.ScreenSpaceEventHandler;
    private connectLinks: Map<string, Cesium.Entity>;
    private highLightId: string

    constructor(viewer: Cesium.Viewer, timeRange: { startTime: string, stopTime: string }, loop?: boolean) {
        this.viewer = viewer;
        this.viewer.scene.globe.depthTestAgainstTerrain = false;
        this.viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider()
        this.models = new Map();
        this.connectLinks = new Map();
        this.staticModels = new Map();
        this.animationLoop = loop;
        this.startTime = timeRange.startTime ? Cesium.JulianDate.addHours(Cesium.JulianDate.fromDate(new Date(timeRange.startTime)), 0, new Cesium.JulianDate()) : Cesium.JulianDate.addHours(new Cesium.JulianDate(), 0, new Cesium.JulianDate());
        this.stopTime = timeRange.stopTime ? Cesium.JulianDate.addHours(Cesium.JulianDate.fromDate(new Date(timeRange.stopTime)), 0, new Cesium.JulianDate()) : Cesium.JulianDate.addHours(new Cesium.JulianDate(), 0, new Cesium.JulianDate());
        this.setViewerClock(this.startTime, this.stopTime)
        this.startClickListening()
    }
    /**
     * 添加模型实体
     * @param id 模型id，唯一标识
     * @param points 途经点坐标
     * @param option 
     * {
     *  modelPath: string;
        iconPath: string;
        speed: number;
        showLine?: boolean;
        showPoint?: boolean;
        isViewTrack?: boolean;
        startTime?: string;
     * }
     * @returns ModelEntity
     */
    public addModel = (id: string, points: Point[], option: ModelMoveOption) => {
        const model = new ModelEntity(this.viewer, points, option);
        this.models.set(id, model);
        return model;
    }

    public addStaticModel = (id: string, option: ModelStaticOption) => {
        const staticModel = new StaticEntity(this.viewer, option);
        this.staticModels.set(id, staticModel);
        return staticModel;
    }
    /**
     * 修改时间速率
     * @param mult 事件倍速
     */
    public changeSpeed = (mult: number) => {
        this.viewer.clockViewModel.multiplier = mult;
    }

    /**
     * 根据id移除模型
     * @param id 
     */
    public removeModel = (id: string) => {
        const model = this.models.get(id);
        if (model) {
            model.destroy();
            this.models.delete(id);
        }
    }

    private setViewerClock = (startTime: Cesium.JulianDate, stopTime?:Cesium.JulianDate) => {
        this.viewer.clock.startTime = startTime.clone();   // 给cesium时间轴设置开始的时间
        this.viewer.clock.stopTime = stopTime.clone();     // 设置cesium时间轴设置结束的时间
        this.viewer.clock.currentTime = startTime.clone(); // 设置cesium时间轴设置当前的时间
        // 时钟范围  枚举
        // CLAMPED
        // 达到终止时间后停止
        // LOOP_STOP
        // 达到终止时间后重新循环
        // UNBOUNDED
        // 达到终止时间后继续读秒
        this.viewer.clock.clockRange = this.animationLoop ? Cesium.ClockRange.LOOP_STOP : Cesium.ClockRange.CLAMPED;
        // 开启动画
        this.viewer.clockViewModel.shouldAnimate = true;
        //时间变化来控制速度 
        this.viewer.clock.multiplier = 2;// 时间速率，数字越大时间过的越快
        //给时间线设置边界
        // 如果存在
        // viewer.timeline.zoomTo(start, stop);
        this.listenTimeEvent()
    }

    /**
     * 设置当前时间
     */
    public setCurrentTime = (time: string) => {
        let julianTime = Cesium.JulianDate.addHours(Cesium.JulianDate.fromDate(new Date(time)), 0, new Cesium.JulianDate());
        this.viewer.clock.currentTime = julianTime.clone();
    }

    private listenTimeEvent = () => {
        this.viewer.clock.onTick.addEventListener(this.onTick);
        this.viewer.clock.onStop.addEventListener(this.onStop);
    }

    private onTick = () => {
        var currentTime = this.viewer.clock.currentTime;
        if (this.viewer.clock.shouldAnimate) {
            for (var i = 0; i < this.tempEvents.length; i++) {
                var event = this.tempEvents[i]
                if (Cesium.JulianDate.greaterThanOrEquals(currentTime, Cesium.JulianDate.addHours(Cesium.JulianDate.fromDate(new Date(event.time)), 0, new Cesium.JulianDate()))) {
                    event.action(event.type)
                    this.tempEvents.splice(i, 1)
                }
            }
        }
        // if(this.tempEvents.length<1){
        //     this.viewer.clock.onTick.removeEventListener(this.onTick)
        // }
    }

    public setTimeEvents = (list: TimeEvent[]) => {
        this.timeEventList = list;
        this.tempEvents = [...this.timeEventList]
    }

    public addTimeEvent = (event: TimeEvent) => {
        this.timeEventList.push(event)
        this.tempEvents.push(event)
    }

    private onStop = () => {
        this.tempEvents = [...this.timeEventList]
        this.viewer.clock.onTick.addEventListener(this.onTick);
    }

    public showSpecial = (txposition: Point, type: number) => {
        let position = Cesium.Cartesian3.fromDegrees(txposition.longitude, txposition.latitude, txposition.height);
        var evbillboard = this.viewer.entities.add({
            position: position,
            billboard: {
                image: "",                  //开启动画
                width: type === 1 ? 1000 : 500,
                height: type === 1 ? 800 : 400,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                sizeInMeters: true
            },
            show: false
        });
        this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        // 创建GIF动画
    }

    public createConnectLink = (startId: string, endId: string) => {
        let dynamicMaterial = new PolylineTrailLinkMaterialProperty('@/static/img/line.webp', Cesium.Color.fromCssColorString('#ffff88'), 2000)
        let link = this.viewer.entities.add({
            polyline: {
                //位置
                positions: new Cesium.CallbackProperty(() => {
                    let mdl1 = this.models.get(startId)
                    let mdl2 = this.models.get(endId)
                    if (mdl1?.ModeleEntity?.position && mdl2?.ModeleEntity?.position) {
                        let pos1 = mdl1.ModeleEntity.position.getValue(this.viewer.clock.currentTime);
                        let pos2 = mdl2.ModeleEntity.position.getValue(this.viewer.clock.currentTime);
                        if (pos1 && pos2) {
                            return [pos1, pos2]
                        } else {
                            this.viewer.entities.remove(link)
                            this.connectLinks.delete(`${startId}to${endId}`)
                        }
                    } else {
                        if (this.connectLinks.has(`${startId}to${endId}`)) {
                            this.viewer.entities.remove(link)
                            this.connectLinks.delete(`${startId}to${endId}`)
                        }
                    }
                },false),
                //线宽
                width: 2,
                //路线颜色 
                material: dynamicMaterial,
            },
        });
        this.connectLinks.set(`${startId}to${endId}`, link)
    }
    public removeConnectLink = (startId: string, endId: string) => {
        let link = this.connectLinks.get(`${startId}to${endId}`)
        if (link) {
            this.viewer.entities.remove(link)
            this.connectLinks.delete(`${startId}to${endId}`)
        }
    }
    /**
     * 控制动画
     * @param move 
     */
    public shouldAnimate(move: boolean) {
        this.viewer.clock.shouldAnimate = move;
    }


    public markModel = (id: string) => {
        const model = this.models.get(id);
        if (model) {
            model.markedModel()
        }
    }

    public setRadarVisiable = (show: boolean, id: string) => {
        const model = this.models.get(id);
        if (model) {
            model.setRadarVisiable(show);
        }
    }

    /**
     * 模型视角跟随
     * @param id 
     * @param val 是否跟随boolean
     */
    public toggleViewTrack = (val: boolean) => {
        if (this.highLightId) {
            const model = this.models.get(this.highLightId);
            if (model) {
                model.changeViewTrack(val);
            }
        } else {
            this.viewer.trackedEntity = null
            ElMessage.error("请先选中要跟随的目标")
        }
    }

    public toggleInfoPanel = (val: boolean, id?: string) => {
        if (id && this.models.has(id)) {
            this.models.get(id).handlePanelShow(val)
        } else {
            this.models.forEach(model => {
                model.handlePanelShow(val)
            })
        }
    }

    public togglePathPoint = (val: boolean, id?: string) => {
        if (id && this.models.has(id)) {
            this.models.get(id).handlePointShow(val)
        } else {
            this.models.forEach(model => {
                model.handlePointShow(val)
            })
        }
    }

    public togglePath = (val: boolean, id?: string) => {
        if (id && this.models.has(id)) {
            this.models.get(id).handlePathShow(val)
        } else {
            this.models.forEach(model => {
                model.handlePathShow(val)
            })
        }
    }

    /**
     * 设置当前时间范围
     * @param start 
     * @param end 
     */
    public setTimelineRange = (start: Cesium.JulianDate, end: Cesium.JulianDate) => {
        this.viewer.timeline.zoomTo(start, end);
    }

    public changeModelTimeRange = (id: string, start: number, end: number) => {
        const model = this.models.get(id);
        if (model) {
            const clock = this.viewer.clock;
            clock.startTime = Cesium.JulianDate.fromIso8601(new Date(start * 1000) as any);
            clock.stopTime = Cesium.JulianDate.fromIso8601(new Date(end * 1000) as any);
            clock.currentTime = clock.startTime;
            clock.multiplier = (end - start) / (24 * 60 * 60); // 假设以秒为单位
        }
    }

    /**
     * 监听鼠标双击事件
     */

    public startClickListening() {
        if (!this.viewer)
            return
        if (this.viewer && !this.clickHandler) {
            this.clickHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
            this.clickHandler.setInputAction((event) => {
                console.log("event", event.position, this.viewer)
                var pick = this.viewer.scene.pick(event.position);
                if (Cesium.defined(pick)) {
                    console.log("defined.pick", pick.id.id)
                    this.setModelHighlight(pick.id.id)
                } else {
                    console.log('error:无效位置')
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        } else {
            console.log('error:viewer或handle错误')
        }
    }
    // 关闭点击事件监听
    public stopClickListening() {
        if (this.clickHandler) {
            this.clickHandler.destroy();
            this.clickHandler = null;
        }
    }

    public setModelHighlight = (id: string) => {
        this.models.forEach((model) => {
            model.hightLight(false)
        })

        if (this.models.has(id)) {
            if (this.highLightId !== id) {
                this.highLightId = id
                this.models.get(id).hightLight(true)
                selectMoveModel.emit(this.highLightId)
            } else {
                this.highLightId = undefined
                selectMoveModel.emit(this.highLightId)
            }
        }

    }

    /**
     * 销毁所有实体
     */
    public destoryAll = () => {
        this.models.forEach((model) => {
            model.destroy();
        })
        this.connectLinks.forEach((link) => {
            this.viewer.entities.remove(link)
        })
        this.staticModels.forEach((model) => {
            model.destroy();
        })
        this.models.clear()
        this.connectLinks.clear()
        this.viewer.clock.onTick.removeEventListener(this.onTick);
        this.viewer.clock.onStop.removeEventListener(this.onStop);
        this.stopClickListening()
        this.viewer.clock.shouldAnimate = false
    }
}

export default ModelManager;