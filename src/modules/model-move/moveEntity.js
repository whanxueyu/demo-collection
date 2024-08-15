
import * as Cesium from 'cesium'
type Point = {
    longitude: number,
    latitude: number,
    height: number,
    speed?: number,
    heading?: number,
    pitch?: number,
    roll?: number
}
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

class ModelEntity {
    private viewer: Cesium.Viewer;
    private points: Point[];
    private modeleEntity: Cesium.Entity;
    private pointEntities: Cesium.Entity[];
    private panelEntity: Cesium.Entity;
    private radarEntity: Cesium.Entity;
    private speed: number;
    private modelPath: string;
    private modelName: string;
    private modelId: string;
    private iconPath: string;
    private isViewTrack: boolean | string;
    public startTime: Cesium.JulianDate;
    private showLine?: boolean | string;
    private showPoint?: boolean | string;
    private clampGround?: boolean | string;
    private enableScan?: boolean | string;
    private scanRadius?: number;
    private modelType?: string;
    private camp?: string;
    private waveH = 1000;
    private waveW = 0;
    private scan: any

    constructor(viewer: Cesium.Viewer, points: Point[], option: ModelMoveOption) {
        this.viewer = viewer;
        this.scan = new Cesium.EV_CircleScan(this.viewer);
        this.points = points;
        this.speed = option.speed;
        this.modelPath = option.modelPath;
        this.iconPath = option.iconPath;
        this.isViewTrack = option.isViewTrack === true || option.isViewTrack === 'true' ? true : false;
        this.modelName = option.name;
        this.modelId = option.id;
        this.showLine = option.showLine === true || option.showLine === 'true' ? true : false;
        this.showPoint = option.showPoint === true || option.showPoint === 'true' ? true : false;
        this.clampGround = option.clampGround === true || option.clampGround === 'true' ? true : false;
        this.enableScan = option.enableScan === true || option.enableScan === 'true' ? true : false;
        this.scanRadius = option.scanRadius;
        this.modelType = option.modelType;
        this.camp = option.camp;
        this.startTime = option.startTime ? Cesium.JulianDate.addHours(Cesium.JulianDate.fromDate(new Date(option.startTime)), 0, new Cesium.JulianDate()) : Cesium.JulianDate.addHours(new Cesium.JulianDate(), 8, new Cesium.JulianDate());
        this.addModel();
        this.pointEntities = []
        this.addPoint(this.points)
    }
    public get ModeleEntity(): Cesium.Entity {
        return this.modeleEntity
    }
    private addModel = () => {
        // 位置信息和时间
        let property = this.computeFlight(this.points, this.startTime, this.speed);
        // 设置开始停止时间
        var times = property._property._times;
        var start = times[0];
        var stop = times[times.length - 1];
        this.modeleEntity = this.viewer.entities.add({
            // 和时间轴关联
            availability: new Cesium.TimeIntervalCollection([
                new Cesium.TimeInterval({
                    start: start,
                    stop: stop,
                }),
            ]),
            position: property,
            // 根据所提供的速度计算模型的朝向
            orientation: new Cesium.VelocityOrientationProperty(property),
            id: this.modelId,
            // 模型数据
            model: {
                uri: this.modelPath,
                minimumPixelSize: 64,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 20000),
                color: undefined,
                colorBlendMode: undefined,
                colorBlendAmount: undefined,
                silhouetteColor: this.camp === 'blue' ? Cesium.Color.fromCssColorString('#44ccff') : Cesium.Color.fromCssColorString('#ff5555'),
                silhouetteSize: 0,
                scale: 2.5,
                // depthTestAgainstTrrrain: false,
                // clampToGround: true,
                // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
                heightReference: this.clampGround ? Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.NONE
            },
            label: {
                text: `ID：${this.modelId}\n名称：${this.modelName}\n经度：${Cesium.Math.toDegrees(Number(this.points[0].longitude)).toFixed(6)}\n纬度：${Cesium.Math.toDegrees(Number(this.points[0].latitude)).toFixed(6)}`,
                font: '10px',
                pixelOffset: new Cesium.Cartesian2(60, -126),
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                // verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            },
            billboard: {
                image: './img/icon/div2.png',
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                pixelOffset: new Cesium.Cartesian2(5, -5),
                width: 200,
                height: 220,
                // color: this.camp === 'blue' ? Cesium.Color.fromCssColorString('#44ccff') : Cesium.Color.fromCssColorString('#fff'),
            },
            path: {
                show: this.showLine as boolean,
                resolution: 1,
                width: 6,
                leadTime: 0,
                trailTime: 30,
                material: new Cesium.EV_DynamicPolyline(Cesium.Color.fromCssColorString('#cc3333'), 1, Cesium.EV_DynamicPolyline.Direction.AntiClockWise)
            },
        });
        this.modeleEntity.position.setInterpolationOptions({
            interpolationDegree: 1,
            interpolationAlgorithm: Cesium.HermitePolynomialApproximation
            // interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
        })
        this.listenTick()
        this.addMilitaryModel(this.modeleEntity)
        console.log(Number(this.points[0].height))
        if (this.enableScan) {
            if (this.modelType === 'plane') {
                setTimeout(() => {
                    this.createPlaneRadar()
                }, 2000)
            } else if (this.modelType === 'boat') {
                setTimeout(() => {
                    this.createBoatRadar()
                }, 2000)
            }
        }
    }
    /**
     * 信息面板
     * @param modeleEntity 
     * @returns 
     */
    private addMilitaryModel(modeleEntity: Cesium.Entity) {
        if (!modeleEntity) return
        this.panelEntity = this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(Number(this.points[0].longitude), Number(this.points[0].latitude), Number(this.points[0].height)),
            parent: this.ModeleEntity,
            model: {
                show: false,
                uri: this.iconPath,
                minimumPixelSize: 64,
                maximumPixelSize: 128,
                depthTestAgainstTrrrain: false,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(20000, Infinity),
                // heightReference: this.clampGround ? Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.NONE
            },
        })
    }
    private createPlaneRadar() {
        // this.radarEntity = this.viewer.entities.add({
        //     position: new Cesium.CallbackProperty(() => {
        //         let position = this.modeleEntity.position.getValue(this.viewer.clock.currentTime)
        //         if (position) {
        //             let cartographic = Cesium.Cartographic.fromCartesian(position);
        //             if (cartographic) {
        //                 return Cesium.Cartesian3.fromRadians(Number(cartographic.longitude), Number(cartographic.latitude), Number(cartographic.height - 5000))
        //             }
        //         }
        //     }),
        //     cylinder: {
        //         show: true,
        //         length: 10000,
        //         topRadius: 0,
        //         bottomRadius: this.scanRadius ?? 3500,
        //         fill: true,
        //         outline: false,
        //         slices: 64,
        //         material: Cesium.Color.RED.withAlpha(0.1),
        //     },
        //     ellipse: {
        //         semiMinorAxis: 0,
        //         semiMajorAxis: 0,
        //         material: Cesium.Color.AQUA.withAlpha(0.3),
        //         outline: true,
        //         outlineWidth: 25,
        //         outlineColor: Cesium.Color.AQUA,
        //         height: 10000
        //     }
        // })
        // console.log("createPlaneRadar", this.radarEntity)
        // this.viewer.zoomTo(this.radarEntity)
        var direction = Cesium.Cartesian3.subtract(
            Cesium.Cartesian3.fromDegrees(Number(this.points[0].longitude), Number(this.points[0].latitude), 2500),
            Cesium.Cartesian3.fromDegrees(Number(this.points[0].longitude), Number(this.points[0].latitude), 10000),
            new Cesium.Cartesian3()
        );
        this.radarEntity = new CesiumEMGEExtensions.EV_CustomCylinder({
            viewer: this.viewer,
            startPosition: Cesium.Cartesian3.fromDegrees(Number(this.points[0].longitude), Number(this.points[0].latitude), Number(this.points[0].height)),
            direction: direction,
            length: 10000,
            fillColor: new Cesium.Color(1.0, 0, 0, 0.5),
            fillStyle: window.CesiumEMGEExtensions.EV_CustomCylinder.fillType.stripe,
            speed: 1.0,
            multiply: 10,
            show: true,
            bottomRadius: this.scanRadius ?? 3500,
            topRadius: 0,
        });
    }
    private createBoatRadar() {
        this.radarEntity = this.viewer.entities.add({
            position: new Cesium.CallbackProperty(() => {
                let position = this.modeleEntity.position.getValue(this.viewer.clock.currentTime)
                if (position) {
                    let cartographic = Cesium.Cartographic.fromCartesian(position);
                    if (cartographic) {
                        return Cesium.Cartesian3.fromRadians(Number(cartographic.longitude), Number(cartographic.latitude), Number(cartographic.height - 5000))
                    }
                }
            },false),
            ellipse: {
                semiMinorAxis: 0,
                semiMajorAxis: 0,
                material: Cesium.Color.AQUA.withAlpha(0.3),
                outline: true,
                outlineWidth: 25,
                outlineColor: Cesium.Color.AQUA,
                height: 1,
            }
        })
        console.log("createBoatRadar", this.radarEntity)

        // this.radarEntity = this.scan.addCircleScan({
        //     lon: Number(this.points[0].longitude),
        //     lat: Number(this.points[0].latitude),
        //     height: Number(this.points[0].height),
        //     radius: 2000,
        //     scanColor: new Cesium.Color(0.5, 0, 0),
        //     interval: 5000,
        //     quantity: 4
        // });
        
    }
    public setRadarVisiable = (show:boolean)=>{
            this.radarEntity.show = show
    }

    public hightLight = (val: boolean) => {
        if (val) {
            this.modeleEntity.model.silhouetteSize = 4;
            this.modeleEntity.label.fillColor = this.camp === 'blue' ? Cesium.Color.fromCssColorString('#0055ff') : Cesium.Color.fromCssColorString('#ff0055');
            this.modeleEntity.model.color = this.camp === 'blue' ? Cesium.Color.fromCssColorString('#0055ff') : Cesium.Color.fromCssColorString('#ff0055');
            this.modeleEntity.model.colorBlendMode = Cesium.ColorBlendMode.HIGHLIGHT;
            this.modeleEntity.model.colorBlendAmount = 0.5;
        } else {
            this.modeleEntity.model.silhouetteSize = 0;
            this.modeleEntity.label.fillColor = Cesium.Color.fromCssColorString('#ffffff')
            this.modeleEntity.model.color = undefined;
            this.modeleEntity.model.colorBlendMode = undefined;
            this.modeleEntity.model.colorBlendAmount = undefined;
        }
    }

    private listenTick = () => {
        this.viewer.clock.onTick.addEventListener(() => {
            this.updatePanleContent()
        });
    }

    public markedModel = () => {
        this.modeleEntity.billboard.color = Cesium.Color.fromCssColorString('#ffff66')
    }

    private updatePanleContent() {
        const position = this.modeleEntity.position.getValue(this.viewer.clock.currentTime)
        if (position) {
            this.panelEntity.model.show = true
            this.panelEntity.position = position;
            this.panelEntity.orientation = this.modeleEntity.orientation;
            let cartographic = Cesium.Cartographic.fromCartesian(position);
            this.modeleEntity.label.text = `ID：${this.modelId}\n名称：${this.modelName}\n经度：${Cesium.Math.toDegrees(cartographic.longitude).toFixed(6)}\n纬度：${Cesium.Math.toDegrees(cartographic.latitude).toFixed(6)}`

            if (this.radarEntity) {
                if (this.modelType === 'plane') {
                    // this.updateWave(cartographic.height)
                    // this.radarEntity.ellipse.semiMinorAxis = this.waveW
                    // this.radarEntity.ellipse.semiMajorAxis = this.waveW
                    // this.radarEntity.ellipse.height = this.waveH
                    this.radarEntity.startPosition = position
                } else if (this.modelType === 'boat') {
                    this.updateWave2()
                    this.radarEntity.ellipse.semiMinorAxis = this.waveW
                    this.radarEntity.ellipse.semiMajorAxis = this.waveW
                    // this.radarEntity.lon = Cesium.Math.toDegrees(cartographic.longitude);
                    // this.radarEntity.lat = Cesium.Math.toDegrees(cartographic.latitude);
                }
            }
        } else {
            if (this.panelEntity) {
                this.panelEntity.model.show = false
            }
        }
    }

    private updateWave = (height: number) => {
        this.waveH = this.waveH - 200
        if (this.waveH < 1) {
            this.waveH = height
        }
        this.waveW = this.scanRadius - ((Number(this.scanRadius) / height) * this.waveH);
    }

    private updateWave2 = () => {
        this.waveW = this.waveW + 500
        if (this.waveW > this.scanRadius) {
            this.waveW = 0
        }
    }

    public changeViewTrack = (val: boolean) => {
        this.isViewTrack = val
        if (val) {
            if (this.isViewTrack)
                this.viewer.zoomTo(
                    this.modeleEntity
                ).then(() => {
                    this.viewer.trackedEntity = this.modeleEntity;
                });
        } else {
            this.viewer.trackedEntity = null
        }
    }

    public handlePanelShow = (show: boolean) => {
        this.modeleEntity.billboard.show = show
        this.modeleEntity.label.show = show
    }

    public handlePointShow = (show: boolean) => {
        this.pointEntities.forEach((point) => {
            point.show = show
        })
    }

    public handlePathShow = (show: boolean) => {
        if (show) {
            this.ModeleEntity.path.show = show;
            this.ModeleEntity.path.leadTime = undefined;
            this.modeleEntity.path.trailTime = undefined;
            this.modeleEntity.path.material = Cesium.Color.AQUA
        } else {
            this.ModeleEntity.path.leadTime = 0;
            this.modeleEntity.path.trailTime = 30;
            this.modeleEntity.path.material = new Cesium.EV_DynamicPolyline(Cesium.Color.RED.withAlpha(0.9), 1, Cesium.EV_DynamicPolyline.Direction.AntiClockWise)
        }
    }

    public destroy = () => {
        this.viewer.entities.remove(this.modeleEntity)
        this.viewer.entities.remove(this.panelEntity)
        if (this.radarEntity)
            // this.viewer.entities.remove(this.radarEntity)
            // this.viewer.entities.remove(this.radarEntity)
            if (this.radarEntity instanceof Cesium.Entity) {
                this.viewer.entities.remove(this.radarEntity);
            } else if (this.radarEntity instanceof Cesium.Primitive) {
                this.viewer.scene.primitives.remove(this.radarEntity);
            } else {
                this.radarEntity.destroy();
            }
        this.scan.removeAll()
        this.pointEntities.forEach((item) => {
            this.viewer.entities.remove(item)
        })
    }
    // 添加拐点
    private addPoint = (points: Point[]) => {
        points.forEach((item, index) => {
            var position = Cesium.Cartesian3.fromDegrees(
                Number(item.longitude),
                Number(item.latitude),
                Number(item.height)
            );
            let pointEntity = this.viewer.entities.add({
                position: position,
                show: this.showPoint as boolean,
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.fromCssColorString("green"),
                    outlineWidth: 2,
                    outlineColor: Cesium.Color.YELLOWGREEN,
                    // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
            });
            if (pointEntity)
                this.pointEntities.push(pointEntity)
        })
    }
    // 计算用时
    private getDuration = (start: Point, end: Point, speed: number): number => {
        let startPoint = Cesium.Cartographic.fromDegrees(Number(start.longitude), Number(start.latitude), Number(start.height))
        let endPoint = Cesium.Cartographic.fromDegrees(Number(end.longitude), Number(end.latitude), Number(end.height))
        let geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(startPoint, endPoint);
        let distance = geodesic.surfaceDistance;
        let sp = start?.speed ? start.speed : speed
        return Math.ceil(distance / sp)
    }
    // 位置信息
    private computeFlight = (list: Point[], start: Cesium.JulianDate, speed: number) => {
        var property = new Cesium.SampledPositionProperty();
        let durationList: Cesium.JulianDate[] = [start]
        for (var i = 0; i < list.length; i++) {
            let duration: number;
            if (i === 0) {
                duration = 0
            } else {
                let startPoit = list[i - 1]
                let endPoint = list[i]
                duration = this.getDuration(startPoit, endPoint, speed)

                // let pointNum = Math.floor(duration / 30)
                // let line = turf.lineString([[Number(list[i - 1].longitude), Number(list[i - 1].latitude)], [Number(list[i].longitude), Number(list[i].latitude)]])
                // let perHeight = (Number(list[i - 1].height) - Number(list[i].height)) / pointNum
                // let perLength = 30 * this.speed
                // for (i = 1; i < pointNum; i++) {
                //     let point = turf.along(line, i * perLength, { units: 'meters' })
                //     let heigt = Number(list[i - 1].height) - i * perHeight
                //     console.log(point, heigt)
                // }

            }
            var thisTime = Cesium.JulianDate.addSeconds(durationList[i], duration, new Cesium.JulianDate());
            durationList.push(thisTime)
            var position = Cesium.Cartesian3.fromDegrees(
                Number(list[i].longitude),
                Number(list[i].latitude),
                Number(list[i].height)
            );
            if (thisTime > this.viewer.clock.stopTime) {
                this.viewer.clock.stopTime = thisTime.clone()
            }
            // 添加每一个链接点的信息，到达的时间以及坐标位置
            property.addSample(thisTime, position);
        }
        return property;
    }
}
export default ModelEntity;