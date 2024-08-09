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
import { EventArgs, Subscriber } from "../subscriber";
import { GraphTransform } from "../math/position-transform";
import { GeoPositon } from "../types";
import { nanoid } from "nanoid";
//用于拾取判断
export const ControlLayer: string = "control-layer";
const translateModels = ['/models/control/Translate/Translate_X.glb', '/models/control/Translate/Translate_Y.glb', '/models/control/Translate/Translate_Z.glb',]
export interface ControlProp {
    id: string,
    position: Cartesian3,
    type: string,
}

class ControlEntityProp extends Entity {
    sid?: string;
    renderLayerId?: string;
    constructor(options?: Entity.ConstructorOptions) {
        super(options);
    }
}

export class ControlEntity {
    private sid?: string;
    private left_press: boolean = false;
    layerId?: string;
    private subscriber: Subscriber;
    private callbacks: string[] = [];
    public associateId: string;
    options: ControlProp;
    private entitys: Map<string, ControlEntityProp>;
    private chooseAxis: string = ''
    private viewer: Viewer;
    matrix;
    inverseMatrix;
    normalX;
    normalY;
    normalZ;
    private positionsCallback?: (newPosition: Cesium.Cartesian3) => void;
    constructor(viewer: Viewer, options: ControlProp, positionsCallback: (newPosition: Cartesian3) => void, layerId?: string) {
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
        if (options.type === 'translate') {
            for (var i = 0; i < translateModels.length; i++) {
                let modelGriph: ModelGraphics = new ModelGraphics({
                    uri: translateModels[i],
                    minimumPixelSize: 200,
                    maximumScale: 20000,
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
        } else {

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
                    console.log("Modify", selectedEntity)
                    if (selectedEntity.name)
                        this.chooseAxis = selectedEntity.name
                    this.viewer.scene.screenSpaceCameraController.enableRotate = false
                    this.viewer.scene.screenSpaceCameraController.enableInputs = false
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
                }
            }
            // if (this.selectedEntity) {
            //     // 根据名称修改定位
            //     const cartographic = Cartographic.fromCartesian(this.options.position);
            //     const oldLongitude = Cesium.Math.toDegrees(cartographic.longitude);
            //     const oldLatitude = Cesium.Math.toDegrees(cartographic.latitude);
            //     const oldHeight = cartographic.height;
            //     let position: any = {}
            //     if (this.selectedEntity.name === 'Translate_X') {
            //         position = {
            //             longitude: oldLongitude,
            //             latitude: oldLatitude + (endCartesian.lat - startCartesian.lat),
            //             height: oldHeight,
            //         }
            //     } else if (this.selectedEntity.name === 'Translate_Y') {
            //         position = {
            //             longitude: oldLongitude + (endCartesian.lng - startCartesian.lng),
            //             latitude: oldLatitude,
            //             height: oldHeight,
            //         }
            //     } else if (this.selectedEntity.name === 'Translate_Z') {
            //         position = {
            //             longitude: oldLongitude,
            //             latitude: oldLatitude,
            //             height: oldHeight + (endCartesian.alt - startCartesian.alt),
            //         }
            //     }

            //     this.entitys.forEach((entity) => {
            //         if (entity && entity.position) {
            //             entity.position = new ConstantPositionProperty(
            //                 Cartesian3.fromDegrees(position.longitude, position.latitude, position.height)
            //             )
            //         }
            //     })
            //     this.options.position = Cartesian3.fromDegrees(position.longitude, position.latitude, position.height)
            // }
        }

    }
    public changePosition(e: EventArgs) {
        const startPosition = e.startPosition;
        const endPosition = e.endPosition;
        let chooseNormal;
        if (this.chooseAxis == "Translate_Y") {
            chooseNormal = this.normalX;
        }
        if (this.chooseAxis == "Translate_X") {
            chooseNormal = this.normalY;
        }
        if (this.chooseAxis == "Translate_Z") {
            chooseNormal = this.normalZ;
        }
        //平移
        if (endPosition && startPosition && chooseNormal) {
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
            const distance = Cesium.Cartesian3.dot(vector3d, chooseNormal) * factor*2; //得到实际世界距离

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
            this.positionsCallback && this.positionsCallback(newPosition);
        }
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
        console.log("destroy",this.options)
        this.subscriber.removeExternal(this.callbacks);
    }
}
