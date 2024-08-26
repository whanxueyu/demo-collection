import {
    Entity,
    ConstantPositionProperty,
    Viewer,
    Cartesian3,
    Cartesian2,
    Cartographic,
    Color,
    ModelGraphics,
    defined as Defined,
    ConstantProperty,
    ColorBlendMode,
} from "cesium";
import * as Cesium from "cesium";
import * as turf from '@turf/turf'
import { EventArgs, Subscriber } from "../subscriber";
import { GraphTransform } from "../math/position-transform";
import { GeoPositon } from "../types";
import { nanoid } from "nanoid";
//用于拾取判断
export const ControlLayer: string = "control-layer";
const translateModels = ['/models/control/Translate/Translate_X.glb', '/models/control/Translate/Translate_Y.glb', '/models/control/Translate/Translate_Z.glb',]
const roateModels = ['/models/control/Rotate/Rotate_X.glb', '/models/control/Rotate/Rotate_Y.glb', '/models/control/Rotate/Rotate_Z.glb',]
const scaleModels = ['/models/control/Scale/Scale_XYZ.glb', '/models/control/Scale/Scale_X.glb', '/models/control/Scale/Scale_XY.glb', '/models/control/Scale/Scale_XZ.glb', '/models/control/Scale/Scale_YZ.glb', '/models/control/Scale/Scale_Y.glb', '/models/control/Scale/Scale_Z.glb',]
interface hprOffset {
    heading: number,
    pitch: number,
    roll: number,
}
export interface ControlProp {
    id: string,
    position: Cartesian3,
    orientation?: hprOffset,
    scale?: number
    type: string,
}

class ControlEntityProp extends Entity {
    sid?: string;
    renderLayerId?: string;
    constructor(options?: Entity.ConstructorOptions) {
        super(options);
    }
}
export interface callbackParams {
    newPosition: Cesium.Cartesian3,
    newQuaternion?: Cesium.Quaternion,
    newScale?: number
}
/**
 * 适用于entity  无旋转
 */
export class ControlEntity {
    private sid?: string;
    private left_press: boolean = false;
    layerId?: string;
    private subscriber: Subscriber;
    private callbacks: string[] = [];
    public associateId: string;
    public options: ControlProp;
    private entitys: Map<string, ControlEntityProp>;
    private chooseAxis: string = ''
    private viewer: Viewer;
    private matrix: Cesium.Matrix4;
    public inverseMatrix: Cesium.Matrix4;
    private normalX: Cesium.Cartesian3;
    private normalY: Cesium.Cartesian3;
    private normalZ: Cesium.Cartesian3;
    private positionsCallback?: (params: callbackParams) => void;
    constructor(viewer: Viewer, options: ControlProp, positionsCallback: (params: callbackParams) => void, layerId?: string) {
        this.viewer = viewer;
        this.entitys = new Map();
        this.subscriber = new Subscriber(this.viewer);
        if (!options.id) {
            options.id = nanoid(10);
        }
        this.options = options;
        this.sid = options.id;
        this.associateId = options.id;
        this.layerId = layerId;
        this.initCtrlStyle(options);
        this.matrix = Cesium.Transforms.eastNorthUpToFixedFrame(this.options.position); //坐标轴的变换矩阵，将坐标轴所在局部坐标转换为世界坐标
        this.inverseMatrix = Cesium.Matrix4.inverse(
            this.matrix,
            new Cesium.Matrix4()
        ); //坐标轴变换矩阵的逆矩阵，将世界坐标转换为坐标轴所在局部坐标

        this.normalX = Cesium.Matrix4.multiplyByPointAsVector(
            this.matrix,
            Cesium.Cartesian3.UNIT_X,
            new Cesium.Cartesian3()
        ); //坐标轴的X单位向量
        this.normalY = Cesium.Matrix4.multiplyByPointAsVector(
            this.matrix,
            Cesium.Cartesian3.UNIT_Y,
            new Cesium.Cartesian3()
        ); //坐标轴的Y单位向量
        this.normalZ = Cesium.Matrix4.multiplyByPointAsVector(
            this.matrix,
            Cesium.Cartesian3.UNIT_Z,
            new Cesium.Cartesian3()
        );
        this.positionsCallback = positionsCallback;
        // 双击
        const callbackLDCID = this.subscriber.addExternal((movement: EventArgs) => {
            this.leftMouseDoubleClick(movement);
        }, "LEFT_DOUBLE_CLICK");
        this.callbacks.push(callbackLDCID);
        // 左下
        const callbackLDID = this.subscriber.addExternal((movement: EventArgs) => {
            this.leftMouseDown(movement);
        }, "LEFT_DOWN");
        this.callbacks.push(callbackLDID);
        // 左起
        const callbackLUID = this.subscriber.addExternal((movement: EventArgs) => {
            this.leftMouseUp(movement);
        }, "LEFT_UP");
        this.callbacks.push(callbackLUID);
        // 移动
        const callbackMMID = this.subscriber.addExternal((movement: EventArgs) => {
            this.mouseMove(movement);
        }, "MOUSE_MOVE");
        this.callbacks.push(callbackMMID);
    }
    /**
     * 
     * @param options 
     * @param position 
     */
    private initCtrlStyle(options: ControlProp) {
        if (options.type.indexOf('translate') !== -1) {
            for (var i = 0; i < translateModels.length; i++) {
                let modelGriph: ModelGraphics = new ModelGraphics({
                    uri: translateModels[i],
                    minimumPixelSize: 150,
                    // maximumScale: 20000,
                    scale: 1,
                    show: true,
                    colorBlendMode: ColorBlendMode.MIX,
                    colorBlendAmount: 0,
                    color: Color.YELLOW.withAlpha(1),
                });
                let cid = this.sid + 'translate' + i;
                let fileName = translateModels[i].slice(translateModels[i].lastIndexOf('/') + 1, translateModels[i].lastIndexOf('.'));
                let ctrlEntity = new ControlEntityProp({
                    id: cid,
                    name: fileName,
                    position: options.position,
                    model: modelGriph,
                });
                ctrlEntity.sid = this.sid || options.id;
                ctrlEntity.renderLayerId = ControlLayer;
                this.viewer.entities.add(ctrlEntity)
                this.entitys.set(cid, ctrlEntity)
            }
        }
        if (options.type.indexOf('roate') !== -1) {
            for (var i = 0; i < roateModels.length; i++) {
                let modelGriph: ModelGraphics = new ModelGraphics({
                    uri: roateModels[i],
                    minimumPixelSize: 200,
                    // maximumScale: 20000,
                    scale: 1,
                    show: i > 1 ? true : false,
                    colorBlendMode: ColorBlendMode.MIX,
                    colorBlendAmount: 0,
                    color: Color.YELLOW.withAlpha(1),
                });
                let cid = this.sid + 'roate' + i;
                let fileName = roateModels[i].slice(roateModels[i].lastIndexOf('/') + 1, roateModels[i].lastIndexOf('.'));
                let ctrlEntity = new ControlEntityProp({
                    id: cid,
                    name: fileName,
                    position: options.position,
                    model: modelGriph,
                });
                ctrlEntity.sid = this.sid || options.id;
                ctrlEntity.renderLayerId = ControlLayer;
                this.viewer.entities.add(ctrlEntity)
                this.entitys.set(cid, ctrlEntity)
            }
        }
        if (options.type.indexOf('scale') !== -1) {
            for (var i = 0; i < scaleModels.length; i++) {
                let modelGriph: ModelGraphics = new ModelGraphics({
                    uri: scaleModels[i],
                    minimumPixelSize: 200,
                    // maximumScale: 20000,
                    scale: 1,
                    show: i === 0 ? true : false,
                    colorBlendMode: ColorBlendMode.MIX,
                    colorBlendAmount: 0,
                    color: Color.YELLOW.withAlpha(1),
                });
                let cid = this.sid + 'scale' + i;
                let fileName = scaleModels[i].slice(scaleModels[i].lastIndexOf('/') + 1, scaleModels[i].lastIndexOf('.'));
                let ctrlEntity = new ControlEntityProp({
                    id: cid,
                    name: fileName,
                    position: options.position,
                    model: modelGriph,
                });
                ctrlEntity.sid = this.sid || options.id;
                ctrlEntity.renderLayerId = ControlLayer;
                this.viewer.entities.add(ctrlEntity)
                this.entitys.set(cid, ctrlEntity)
            }
        }

    }
    public leftMouseDown(movement: EventArgs) {
        if (movement.position == undefined) return;
        const cartesian = this.getLocationByPosition(movement.position);
        if (!cartesian) return false;
        const pickedObject = this.viewer.scene.pick(movement.position);
        if (Defined(pickedObject) && Defined(pickedObject.id)) {
            if (pickedObject.id.renderLayerId === ControlLayer) {
                const selectedEntity = pickedObject.id as ControlEntityProp;
                if (Defined(selectedEntity)) {
                    this.left_press = true;
                    if (selectedEntity.name)
                        this.chooseAxis = selectedEntity.name
                    this.viewer.scene.screenSpaceCameraController.enableRotate = false
                    this.viewer.scene.screenSpaceCameraController.enableInputs = false
                    this.entitys.forEach((entity) => {
                        if (entity && entity.model) {
                            if (entity.id == selectedEntity.id) {
                                entity.model.colorBlendMode = new ConstantProperty(ColorBlendMode.REPLACE);
                            } else {
                                entity.model.colorBlendMode = new ConstantProperty(ColorBlendMode.MIX);
                            }
                        }
                    })
                }
            } else {
                console.log(pickedObject);
            }
        }
    }

    // 双击
    public leftMouseDoubleClick(movement: EventArgs) {
        if (movement.position == undefined) return;
        const cartesian = this.getLocationByPosition(movement.position);
        if (!cartesian) return false;
        const pickedObject = this.viewer.scene.pick(movement.position);
        if (Defined(pickedObject) && Defined(pickedObject.id)) {
            if (pickedObject.id.renderLayerId === ControlLayer) {
                this.destroy()
            }
        }
    }
    public leftMouseUp(movement: EventArgs) {
        this.left_press = false;
        if (movement.position == undefined) return;
        const cartesian = this.getLocationByPosition(movement.position);
        if (!cartesian) return false;
        this.entitys.forEach((entity) => {
            if (entity && entity.model) {
                entity.model.colorBlendMode = new ConstantProperty(ColorBlendMode.MIX);
            }
        })
        this.viewer.scene.screenSpaceCameraController.enableRotate = true
        this.viewer.scene.screenSpaceCameraController.enableInputs = true
    }
    public mouseMove(movement: EventArgs) {
        if (movement.endPosition == undefined) return;
        const endCartesian = this.getLocationByPosition(movement.endPosition);
        const startCartesian = this.getLocationByPosition(movement.startPosition);
        if (!startCartesian) return false;
        if (!endCartesian) return false;
        if (this.left_press) {
            this.changePosition(movement)
            const pickedObject = this.viewer.scene.pick(movement.endPosition);
            if (Defined(pickedObject) && Defined(pickedObject.id)) {
                if (pickedObject.id.renderLayerId === ControlLayer) {
                    const selectedEntity: ControlEntityProp =
                        pickedObject.id as ControlEntityProp;
                    if (Defined(selectedEntity)) {
                        // this.entitys.forEach((entity) => {
                        //     if (entity && entity.model) {
                        //         if (entity.id == selectedEntity.id) {
                        //             entity.model.colorBlendMode = new ConstantProperty(ColorBlendMode.REPLACE);
                        //         } else {
                        //             entity.model.colorBlendMode = new ConstantProperty(ColorBlendMode.MIX);
                        //         }
                        //     }
                        // })

                    }
                }
            }
        }

    }
    public changePosition(e: EventArgs) {
        const startPosition = e.startPosition;
        const endPosition = e.endPosition;
        let chooseNormal;
        let type = 1;//1:translate  2:roate   3:scale
        if (this.chooseAxis == "Translate_Y") {
            chooseNormal = this.normalX;
            type = 1
        }
        if (this.chooseAxis == "Translate_X") {
            chooseNormal = this.normalY;
            type = 1
        }
        if (this.chooseAxis == "Translate_Z") {
            chooseNormal = this.normalZ;
            type = 1
        }
        if (this.chooseAxis == "Rotate_X") {
            chooseNormal = this.normalX;
            type = 2
        }
        if (this.chooseAxis == "Rotate_Y") {
            chooseNormal = this.normalY;
            type = 2
        }
        if (this.chooseAxis == "Rotate_Z") {
            chooseNormal = this.normalZ;
            type = 2
        }
        if (this.chooseAxis == "Scale_XYZ") {
            chooseNormal = this.normalZ;
            type = 3
        }
        //平移
        if (endPosition && startPosition && chooseNormal) {
            if (type === 1) {
                const vector2d = new Cesium.Cartesian3(
                    endPosition.x - startPosition.x,
                    -(endPosition.y - startPosition.y),
                    0
                ); //平面向量
                const vector3d = Cesium.Matrix4.multiplyByPointAsVector(
                    this.viewer.camera.inverseViewMatrix,
                    vector2d,
                    new Cesium.Cartesian3()
                ); //世界坐标的三维向量

                //计算一个比例因子，通过fov与z值计算该距离下的平行裁截面的面的宽度，与屏幕宽度做个比例
                const primitiveInCamera = Cesium.Matrix4.multiplyByPoint(
                    this.viewer.camera.viewMatrix,
                    this.options.position,
                    new Cesium.Cartesian3()
                );
                const cameraFov = (this.viewer.camera.frustum as Cesium.PerspectiveFrustum).fovy;

                const width = - primitiveInCamera.z * Math.tan(cameraFov / 2) * 2;
                const factor = width / this.viewer.canvas.width;
                const distance = Cesium.Cartesian3.dot(vector3d, chooseNormal) * factor * 5; //得到实际世界距离

                //需要计算平移后的点，并且找到相对地表同高度的点
                //平移前的点（经纬度）
                // const currentPosition = Cesium.Cartographic.fromCartesian(this.options.position);
                // console.log(currentPosition)
                //平移后的点
                let newPosition = new Cesium.Cartesian3(
                    this.options.position.x + chooseNormal.x * distance,
                    this.options.position.y + chooseNormal.y * distance,
                    this.options.position.z + chooseNormal.z * distance
                );
                this.entitys.forEach((entity) => {
                    if (entity && entity.position) {
                        entity.position = new ConstantPositionProperty(
                            newPosition
                        )
                    }
                })
                this.options.position = newPosition
                this.positionsCallback && this.positionsCallback({ newPosition: newPosition });
            } else if (type === 2) {
                let offset = this.options.orientation
                let center = this.options.position
                if (this.chooseAxis == "Rotate_Z") {
                    let statrBearing = this.getBearingByWindowPosition(center, startPosition)
                    let endrBearing = this.getBearingByWindowPosition(center, endPosition)
                    offset.heading = offset.heading + (endrBearing - statrBearing)
                }
                var hpr = Cesium.Transforms.headingPitchRollQuaternion(
                    center,
                    Cesium.HeadingPitchRoll.fromDegrees(offset.heading, 0, 0)
                )
                // this.entitys.forEach((entity) => {
                //     if (entity) {
                //         entity!.orientation = new Cesium.ConstantProperty(hpr)
                //     }
                // })
                this.options.orientation.heading = offset.heading
                this.positionsCallback && this.positionsCallback({ newPosition: center, newQuaternion: hpr });
            } else if (type === 3) {
                let center = this.options.position
                let statrDistance = this.getDistanceByWindowPosition(center, startPosition)
                let endrDistance = this.getDistanceByWindowPosition(center, endPosition)
                let newScale = this.options.scale * (endrDistance / statrDistance)
                this.entitys.forEach((entity) => {
                    if (entity) {
                        entity!.model.scale = new Cesium.ConstantProperty(newScale)
                    }
                })
                this.options.scale = newScale
                this.positionsCallback && this.positionsCallback({ newPosition: center, newQuaternion: undefined, newScale: newScale });
            }
        }
    }
    public getBearingByWindowPosition(center: Cesium.Cartesian3, position: Cesium.Cartesian2): number {
        // from
        let sCartographic = Cesium.Cartographic.fromCartesian(center);
        let longitude = Cesium.Math.toDegrees(sCartographic.longitude); // 经度
        let latitude = Cesium.Math.toDegrees(sCartographic.latitude); // 纬度
        // to
        let ray = this.viewer.camera.getPickRay(position);
        let cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
        let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
        var from = turf.point([longitude, latitude]);
        var to = turf.point([lng, lat]);
        let bearing = turf.bearing(from, to);
        return bearing
    }
    public getDistanceByWindowPosition(center: Cesium.Cartesian3, position: Cesium.Cartesian2): number {
        // from
        let sCartographic = Cesium.Cartographic.fromCartesian(center);
        let longitude = Cesium.Math.toDegrees(sCartographic.longitude); // 经度
        let latitude = Cesium.Math.toDegrees(sCartographic.latitude); // 纬度
        // to
        let ray = this.viewer.camera.getPickRay(position);
        let cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
        let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
        var from = turf.point([longitude, latitude]);
        var to = turf.point([lng, lat]);
        let distance = turf.distance(from, to);
        return distance
    }
    /**
 * 带高度的三位位置信息检查
 * @param position 
 * @param result 
 * @returns 
 */
    public getLocationByPosition(
        position: Cartesian2 | undefined
    ): GeoPositon | undefined {
        if (!Defined(position)) return undefined;
        let ray = this.viewer.camera.getPickRay(position!);
        if (ray) {
            let cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
            // let cartesian = this.viewer.scene.pickPosition(position!);
            if (cartesian && Defined(cartesian)) {
                let cartographic = Cartographic.fromCartesian(cartesian);
                let geo: GeoPositon = new GeoPositon();
                geo.lng = Cesium.Math.toDegrees(cartographic.longitude);
                geo.lat = Cesium.Math.toDegrees(cartographic.latitude);
                geo.alt = cartographic.height;
                return geo;
            }
        }
        return undefined;
    }
    public get Id() {
        return this.sid;
    }

    public set LayerId(layerId: string) {
        this.layerId = layerId;
    }

    public set Position(position: GeoPositon) {
        // this.entity.position = new ConstantPositionProperty(
        //     GraphTransform.transformWGS84ToCartesian(position)
        // );
        this.entitys.forEach((value) => {
            value.position = new ConstantPositionProperty(
                GraphTransform.transformWGS84ToCartesian(position))
        })
    }

    public destroy() {
        //删除
        this.entitys.forEach((value) => {
            this.viewer.entities.remove(value);
        })
        console.log("destroy", this.options)
        this.subscriber.removeExternal(this.callbacks);
    }
}
