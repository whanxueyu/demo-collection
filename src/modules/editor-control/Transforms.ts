
import * as Cesium from "cesium";
import { EventArgs, Subscriber } from "../subscriber";
interface ThreeDTilesetSource {
    id: string
    name: string
    url: string
    visible: boolean
    enable?: boolean
    longitude?: number
    latitude?: number
    altitude?: number
    // axis:xz|xy|zx|zy
    x: number
    y: number
    z: number
    skipLevelOfDetail?: boolean
    dynamicScreenSpaceError?: boolean
    brightness?: number
    alpha?: number
    scale?: number
    afterReady?: (viewer: Cesium.Viewer, success: boolean) => void
    outlinecolor?: string
    showOutline?: boolean
    parentId?: string
    rotationX: number,
    rotationY: number,
    rotationZ: number
  }
interface hprOffset {
    heading: number,
    pitch: number,
    roll: number,
}
///物体变换
export default class Transforms {
    //#region 属性
    private viewer: Cesium.Viewer;
    private tileset: Cesium.Cesium3DTileset;
    //是否选择X轴
    private isAxisxDrag: boolean = false;
    //是否选择Y轴
    private isAxisyDrag: boolean = false;
    //是否选择z轴
    private isAxiszDrag: boolean = false;
    //是否选择X轴旋转
    private isRotationAxisxDrag: boolean = false;
    //是否选择Y轴旋转
    private isRotationAxisyDrag: boolean = false;
    //是否选择Z轴旋转
    private isRotationAxiszDrag: boolean = false;
    //拖拽集合
    private AxialprimitivesCollection: Cesium.PrimitiveCollection = new Cesium.PrimitiveCollection();
    //旋转集合
    private RotationAxialprimitivesCollection: Cesium.PrimitiveCollection = new Cesium.PrimitiveCollection();
    // 拖拽合集显示
    private showAxialCollection = true;
    // 旋转合集显示
    private showRotationCollection = true;
    //X轴模型
    private axialxPrimitive: Cesium.Model | undefined = undefined;
    //Y轴模型
    private axialyPrimitive: Cesium.Model | undefined = undefined;
    //Z轴模型
    private axialzPrimitive: Cesium.Model | undefined = undefined;
    //X轴模型
    private rotationAxialxPrimitive: Cesium.Model | undefined = undefined;
    //Y轴模型
    private rotationAxialyPrimitive: Cesium.Model | undefined = undefined;
    //Z轴模型
    private rotationAxialzPrimitive: Cesium.Model | undefined = undefined;
    // 模型数组
    private modelArray: Cesium.Model[] = [];
    // 模型索引
    private modelIndex: number = 0;
    // 是否高亮选中
    private isHighlight: boolean = false;
    //鼠标转为相当于物体的局部坐标第一次
    private onelocalPosition: Cesium.Cartesian3 | undefined = undefined;
    //鼠标转为相当于物体的局部坐标第二次
    private towlocalPostion: Cesium.Cartesian3 | undefined = undefined;
    //默认矩阵
    private DefaultMatrix: Cesium.Matrix4;

    //选择的实体
    private Switchprimitive: Cesium.Model | undefined = undefined;
    private subscriber: Subscriber;
    private callbacks: string[] = [];
    private prop: ThreeDTilesetSource;
    private offset: hprOffset = {
        heading: 0,
        pitch: 0,
        roll: 0,
    }
    //#endregion

    //#region 初始化
    constructor(viewer: Cesium.Viewer, tileset: Cesium.Cesium3DTileset, prop: ThreeDTilesetSource) {
        this.viewer = viewer;
        this.tileset = tileset;
        this.subscriber = new Subscriber(this.viewer);
        this.prop = prop
        //获得原始矩阵
        this.DefaultMatrix = this.tileset.root.transform;
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.AxialprimitivesCollection = this.viewer.scene.primitives.add(this.AxialprimitivesCollection);
        this.RotationAxialprimitivesCollection = this.viewer.scene.primitives.add(this.RotationAxialprimitivesCollection);

        //warn        // this.tileset.allowPicking = false
        //绘制控制柄
        this.updateDrawArrow();
        //添加事件
        this.CreatEvent();
    }
    //#endregion

    get axialy() {
        const transform = this.tileset.root.transform;
        return new Cesium.Cartesian3(transform[0], transform[1], transform[2])
    };

    get axialx() {
        const transform = this.tileset.root.transform;
        return new Cesium.Cartesian3(transform[4], transform[5], transform[6]);
    };
    get axialz() {
        const transform = this.tileset.root.transform;
        return new Cesium.Cartesian3(transform[8], transform[9], transform[10]);
    };
    get propData(): ThreeDTilesetSource {
        this.prop.rotationZ = this.prop.rotationZ + Cesium.Math.toDegrees(this.offset.heading);
        this.prop.rotationX = this.prop.rotationX + Cesium.Math.toDegrees(this.offset.pitch);
        this.prop.rotationY = this.prop.rotationY + Cesium.Math.toDegrees(this.offset.roll);
        return this.prop
    }

    //#region 移动方法

    ///托转移动
    public DragTranslation(mousePosition: EventArgs) {
        if (mousePosition.endPosition) {
            let ray = this.viewer.camera.getPickRay(mousePosition.endPosition)
            if (!ray) return
            const worldPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene);
            const offict = new Cesium.Cartesian3(0, 100, 0);
            if (!worldPosition) return
            const newWorldPosition = Cesium.Cartesian3.add(worldPosition, offict, new Cesium.Cartesian3());
            if (Cesium.defined(newWorldPosition)) {
                const newtransform = Cesium.Matrix4.setTranslation(this.tileset.root.transform, newWorldPosition, new Cesium.Matrix4())
                this.tileset.root.transform = newtransform;
            }
        }
    }
    //移动到
    public TranslationModel(offset: Cesium.Cartesian3) {
        this.prop.x = this.prop.x + offset.x;
        this.prop.y = this.prop.y + offset.y;
        this.prop.z = this.prop.z + offset.z;
        const newtransform = Cesium.Matrix4.multiplyByTranslation(this.tileset.root.transform, offset, new Cesium.Matrix4())
        this.tileset.root.transform = newtransform;
    }
    //#endregion
    public computeCircle(radius: number) {
        const positions = [];
        for (let i = 0; i < 360; i++) {
            const radians = Cesium.Math.toRadians(i);
            positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
        }
        return positions;
    }
    //#region 移动控制轴
    //创建轴向控制柄模型
    public creataxisModel(axialarray: Cesium.Cartesian3[], color: Cesium.Color, name: string, width = 20) {
        const Primitive = new Cesium.Primitive({
            modelMatrix: this.tileset.root.transform,
            releaseGeometryInstances: true,
            geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.PolylineGeometry({
                    positions: axialarray,
                    width: width,
                    arcType: Cesium.ArcType.NONE,
                }),
                id: name
            }),
            appearance: new Cesium.PolylineMaterialAppearance({
                material: new Cesium.Material({
                    fabric: {
                        type: 'PolylineArrow',
                        uniforms: {
                            color: color
                        }
                    }
                }),
                renderState: {
                    depthTest: {
                        enabled: true
                    }
                }
            })
        });
        this.AxialprimitivesCollection.add(Primitive);
        return Primitive;
    }
    public async addAxisModel(name: string, path: string) {
        try {
            const model = await Cesium.Model.fromGltfAsync({
                url: path,
                minimumPixelSize: 200,
                maximumScale: 20000,
                scale: 1,
                id: name,
                color: Cesium.Color.YELLOW.withAlpha(1),
                colorBlendMode: Cesium.ColorBlendMode.MIX,
                colorBlendAmount: 0,
                modelMatrix: this.tileset.root.transform,

            });
            model.id = name;
            this.AxialprimitivesCollection.add(model);
            return model;
        } catch (error) {
            console.log(`Failed to load model. ${error}`);
        }
    }

    //创建一个轴向
    public async CreatAxis(axial: Cesium.Cartesian3, color: Cesium.Color, name: string) {
        console.log(color)
        if (Cesium.Cartesian3.equals(axial, this.axialx)) {
            // const axialarray = [new Cesium.Cartesian3(0, 0, 0), new Cesium.Cartesian3(length, 0, 0)];
            //X轴模型
            // this.axialxPrimitive = this.creataxisModel(axialarray, color, name);
            const axialxPrimitive = await this.addAxisModel(name, '/models/control/Translate/Translate_Y.glb')
            this.axialxPrimitive = axialxPrimitive;
            if (this.axialxPrimitive)
                this.modelArray.push(this.axialxPrimitive)
        }
        else if (Cesium.Cartesian3.equals(axial, this.axialy)) {
            //BUG-1
            // const axialarray = [new Cesium.Cartesian3(0, 0, 0), new Cesium.Cartesian3(0.00001, length, 0)];
            //Y轴模型
            // this.axialyPrimitive = this.creataxisModel(axialarray, color, name);
            const axialyPrimitive = await this.addAxisModel(name, '/models/control/Translate/Translate_X.glb')
            this.axialyPrimitive = axialyPrimitive
            if (this.axialyPrimitive)
                this.modelArray.push(this.axialyPrimitive)

        }
        else if (Cesium.Cartesian3.equals(axial, this.axialz)) {
            // const axialarray = [new Cesium.Cartesian3(0, 0, 0), new Cesium.Cartesian3(0, 0, length)];
            //Z轴模型
            // this.axialzPrimitive = this.creataxisModel(axialarray, color, name);
            const axialzPrimitive = await this.addAxisModel(name, '/models/control/Translate/Translate_Z.glb')
            this.axialzPrimitive = axialzPrimitive
            if (this.axialzPrimitive)
                this.modelArray.push(this.axialzPrimitive)
        }
        //  -----------------------------------------------------------------------------------------
    }
    //更新 轴向
    public UpdateAxis() {
        if (Cesium.defined(this.axialxPrimitive) && this.axialxPrimitive) {
            this.axialxPrimitive.modelMatrix = this.tileset.root.transform;
        }
        if (Cesium.defined(this.axialyPrimitive) && this.axialyPrimitive) {
            this.axialyPrimitive.modelMatrix = this.tileset.root.transform;
        }
        if (Cesium.defined(this.axialzPrimitive) && this.axialzPrimitive) {
            this.axialzPrimitive.modelMatrix = this.tileset.root.transform;
        }

    }

    //显示移动轴
    public showMoveAxishandler(value: boolean) {
        this.AxialprimitivesCollection.show = value;
    }
    //#endregion

    //#region  旋转控制轴
    //创建旋转轴模型
    public creatRotationAxisModel(axial: Cesium.Cartesian3, radius: number, color: Cesium.Color, name: string, width = 20) {
        // const center = Cesium.Matrix4.getTranslation(this.tileset.root.transform, new Cesium.Cartesian3());
        const center = new Cesium.Cartesian3(0, 0, 0);
        //计算路径
        const points = [];
        for (let i = 0; i < 360; i++) {
            const radians = Cesium.Math.toRadians(i);
            const x = center.x + radius * Math.cos(radians);
            const y = center.y + radius * Math.sin(radians);
            const z = center.z;
            if (Cesium.Cartesian3.equals(axial, this.axialz)) {
                points.push(new Cesium.Cartesian3(x, y, z));
            }
            else if (Cesium.Cartesian3.equals(axial, this.axialx)) {
                points.push(new Cesium.Cartesian3(z, x, y));
            }
            else if (Cesium.Cartesian3.equals(axial, this.axialy)) {
                points.push(new Cesium.Cartesian3(y, z, x));
            }
        }
        points.push(points[0]);
        const Primitive = new Cesium.Primitive({
            modelMatrix: this.tileset.root.transform,
            releaseGeometryInstances: true,
            geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.PolylineGeometry({
                    positions: points,
                    width: width,
                    arcType: Cesium.ArcType.NONE,
                }),
                id: name
            }),
            appearance: new Cesium.PolylineMaterialAppearance({
                material: new Cesium.Material({
                    fabric: {
                        // type: 'PolylineOutline', PolylineArrow
                        type: 'PolylineArrow',
                        uniforms: {
                            outlineColor: Cesium.Color.BLACK,
                            color: color,
                            glowPower: 0.5,
                            taperPower: 1,
                            outlineWidth: 3
                        }
                    }
                }),
                renderState: {
                    depthTest: {
                        enabled: true
                    }
                }
            })
        });
        this.RotationAxialprimitivesCollection.add(Primitive);
        return Primitive;
    }
    public async addRotationAxiModel(name: string, path: string) {
        try {
            const model = await Cesium.Model.fromGltfAsync({
                url: path,
                minimumPixelSize: 400,
                maximumScale: 20000,
                scale: 1,
                id: name,
                color: Cesium.Color.YELLOW.withAlpha(1),
                colorBlendMode: Cesium.ColorBlendMode.MIX,
                colorBlendAmount: 0,
                modelMatrix: this.tileset.root.transform,
            });
            model.id = name;
            this.RotationAxialprimitivesCollection.add(model);
            return model;
        } catch (error) {
            console.log(`Failed to load model. ${error}`);
        }
    }
    //创建旋转轴
    public async CreatRotationAxis(axial: Cesium.Cartesian3, color: Cesium.Color, name: string) {
        console.log(color)
        if (Cesium.Cartesian3.equals(axial, this.axialx)) {
            const rotationAxialxPrimitive = await this.addRotationAxiModel(name, '/models/control/Rotate/Rotate_Y.glb');
            this.rotationAxialxPrimitive = rotationAxialxPrimitive;
            if (this.rotationAxialxPrimitive)
                this.modelArray.push(this.rotationAxialxPrimitive)
        }
        else if (Cesium.Cartesian3.equals(axial, this.axialy)) {
            const rotationAxialyPrimitive = await this.addRotationAxiModel(name, '/models/control/Rotate/Rotate_X.glb')
            this.rotationAxialyPrimitive = rotationAxialyPrimitive
            if (this.rotationAxialyPrimitive)
                this.modelArray.push(this.rotationAxialyPrimitive)
        }
        else if (Cesium.Cartesian3.equals(axial, this.axialz)) {
            const rotationAxialzPrimitive = await this.addRotationAxiModel(name, '/models/control/Rotate/Rotate_Z.glb')
            this.rotationAxialzPrimitive = rotationAxialzPrimitive
            if (this.rotationAxialzPrimitive)
                this.modelArray.push(this.rotationAxialzPrimitive)

        }
    }
    //刷新旋转轴
    public UpdateRotationAxis() {
        if (Cesium.defined(this.rotationAxialxPrimitive) && this.rotationAxialxPrimitive) {
            this.rotationAxialxPrimitive.modelMatrix = this.tileset.root.transform;
        }
        if (Cesium.defined(this.rotationAxialyPrimitive) && this.rotationAxialyPrimitive) {
            this.rotationAxialyPrimitive.modelMatrix = this.tileset.root.transform;
        }
        if (Cesium.defined(this.rotationAxialzPrimitive) && this.rotationAxialzPrimitive) {
            this.rotationAxialzPrimitive.modelMatrix = this.tileset.root.transform;
        }
    }
    //显示旋转轴
    public showRotationAxishandler(value: boolean) {
        this.RotationAxialprimitivesCollection.show = value;
    }
    //#endregion

    //#region  控制轴
    //更新轴
    public updateDrawArrow() {
        if (this.AxialprimitivesCollection.length <= 0) {
            this.CreatAxis(this.axialx, Cesium.Color.RED, "axisX");
            this.CreatAxis(this.axialy, Cesium.Color.GREEN, "axisY");
            this.CreatAxis(this.axialz, Cesium.Color.BLUE, "axisZ");
        }
        else {
            this.UpdateAxis();
        }
        if (this.RotationAxialprimitivesCollection.length <= 0) {
            this.CreatRotationAxis(this.axialz, Cesium.Color.BLUE, 'RotationAxisZ');
            this.CreatRotationAxis(this.axialy, Cesium.Color.GREEN, 'RotationAxisY');
            this.CreatRotationAxis(this.axialx, Cesium.Color.RED, 'RotationAxisX');
        }
        else {
            this.UpdateRotationAxis();
        }
    }
    //#endregion

    //#region 辅助方法
    //绘制鼠标点
    public CreatCanvasDrawPoint(name: string, CanvasPosition: Cesium.Cartesian3, color: string) {
        // eslint-disable-next-line no-undef
        let canvas = document.querySelector(name) as HTMLCanvasElement;;
        if (!canvas) {
            // eslint-disable-next-line no-undef
            canvas = document.createElement(name) as HTMLCanvasElement;;
            // eslint-disable-next-line no-undef
            const cesiumCanvas = document.getElementById('cesiumContainer')
            if (!cesiumCanvas) return
            cesiumCanvas.appendChild(canvas);
        }
        canvas.style.display = 'block';
        if (CanvasPosition) {
            // eslint-disable-next-line no-undef
            canvas.style.position = 'absolute';
            canvas.style.top = `${CanvasPosition.y - 10}px`;
            canvas.style.left = `${CanvasPosition.x - 10}px`;
            canvas.style.width = `${20}px`;
            canvas.style.height = `${20}px`;
            canvas.style.pointerEvents = 'none';
            canvas.style.backgroundColor = color;
            return;
        }
        canvas.style.display = 'none';
        // eslint-disable-next-line no-undef
    }
    //#endregion

    //#region 计算类
    //计算中心点和轴线终点
    public GetCountAxialpoint(axial: Cesium.Cartesian3) {
        // 获取正X轴向量
        const modelXYZ = axial;
        // 根据箭头长度计算缩放比例
        const arrowLength = 100.0;
        const scale = Cesium.Cartesian3.magnitude(modelXYZ) * arrowLength;
        // 包围盒中心点
        // const center = tileset.boundingSphere.center;
        //物体中心点
        const center = Cesium.Matrix4.getTranslation(this.tileset.root.transform, new Cesium.Cartesian3());
        const arrowEndX = Cesium.Cartesian3.add(center, Cesium.Cartesian3.multiplyByScalar(modelXYZ, scale, new Cesium.Cartesian3()), new Cesium.Cartesian3());
        return [center, arrowEndX]
    }
    ///计算局部坐标
    public GetLocalPosition(M: Cesium.Matrix4, offset: Cesium.Cartesian3) {
        // 计算物体A的逆变换矩阵
        const MI = new Cesium.Matrix4();
        Cesium.Matrix4.inverse(M, MI);
        // 将物体B的世界坐标表示为齐次坐标
        const PBH = new Cesium.Cartesian4(offset.x, offset.y, offset.z, 1);
        // 计算物体B相对于物体A的局部坐标
        const PLH = new Cesium.Cartesian4();
        Cesium.Matrix4.multiplyByVector(MI, PBH, PLH);
        // 返回结果的前三个分量
        return new Cesium.Cartesian3(PLH.x, PLH.y, PLH.z);
    }
    //计算世界坐标
    public GetWorldPosition(M: Cesium.Matrix4, offset: Cesium.Cartesian3) {
        // 计算物体B的4x4变换矩阵
        const MW = Cesium.Matrix4.multiplyByTranslation(M, offset, new Cesium.Matrix4());
        // 提取物体B的世界坐标
        const PW = Cesium.Matrix4.getTranslation(MW, new Cesium.Cartesian3());
        // 返回结果
        return PW;
    }
    // 计算射线与平面的交点
    public GetIntersectRayPlane(ray: Cesium.Ray, planeNormal: Cesium.Cartesian3) {
        const planePoint = Cesium.Matrix4.getTranslation(this.tileset.root.transform, new Cesium.Cartesian3())
        const rayDirection = ray.direction;
        const rayOrigin = ray.origin;
        // 计算射线与平面的交点
        const denominator = Cesium.Cartesian3.dot(rayDirection, planeNormal);
        if (Math.abs(denominator) < Cesium.Math.EPSILON15) {
            // 射线与平面平行，无交点
            return null;
        }
        const t = Cesium.Cartesian3.dot(Cesium.Cartesian3.subtract(planePoint, rayOrigin, new Cesium.Cartesian3()), planeNormal) / denominator;
        const intersectionPoint = Cesium.Cartesian3.add(rayOrigin, Cesium.Cartesian3.multiplyByScalar(rayDirection, t, new Cesium.Cartesian3()), new Cesium.Cartesian3());
        return intersectionPoint;
    }
    //计算垂足
    public GetPerpendicularFoot(lineA: Cesium.Cartesian3, lineB: Cesium.Cartesian3, Point: Cesium.Cartesian3) {
        const x1 = lineA.x, y1 = lineA.y, z1 = lineA.z;
        const x2 = lineB.x, y2 = lineB.y, z2 = lineB.z;
        const x3 = Point.x, y3 = Point.y, z3 = Point.z;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dz = z2 - z1;

        const t = ((x3 - x1) * dx + (y3 - y1) * dy + (z3 - z1) * dz) / (dx * dx + dy * dy + dz * dz);

        const x4 = x1 + dx * t;
        const y4 = y1 + dy * t;
        const z4 = z1 + dz * t;

        return new Cesium.Cartesian3(x4, y4, z4);
    }
    //获取XYZ 移动向量
    public GetOffsetTranslationXYZ(ray: Cesium.Ray, axial: Cesium.Cartesian3) {
        let offsetVector = new Cesium.Cartesian3(0, 0, 0);;
        let DistanceL = 0;
        if (Cesium.Cartesian3.equals(axial, this.axialx)) {
            //点击的世界坐标位置
            const clickpoint = this.GetIntersectRayPlane(ray, this.axialz);
            //二次点击
            if (!clickpoint) return
            if (!this.onelocalPosition) return
            this.towlocalPostion = this.GetLocalPosition(this.tileset.root.transform, clickpoint);
            DistanceL = this.towlocalPostion.x - this.onelocalPosition.x;
            offsetVector = new Cesium.Cartesian3(DistanceL, 0, 0);
        }
        else if (Cesium.Cartesian3.equals(axial, this.axialy)) {
            //点击的世界坐标位置
            const clickpoint = this.GetIntersectRayPlane(ray, this.axialz);
            //二次点击
            if (!clickpoint) return
            if (!this.onelocalPosition) return
            this.towlocalPostion = this.GetLocalPosition(this.tileset.root.transform, clickpoint);
            DistanceL = this.towlocalPostion.y - this.onelocalPosition.y;
            offsetVector = new Cesium.Cartesian3(0, DistanceL, 0);
        } else if (Cesium.Cartesian3.equals(axial, this.axialz)) {
            //点击的世界坐标位置
            const clickpoint = this.GetIntersectRayPlane(ray, this.axialx);
            //二次点击
            if (!clickpoint) return
            if (!this.onelocalPosition) return
            this.towlocalPostion = this.GetLocalPosition(this.tileset.root.transform, clickpoint);
            DistanceL = this.towlocalPostion.z - this.onelocalPosition.z;
            offsetVector = new Cesium.Cartesian3(0, 0, DistanceL);
        }
        return offsetVector
    }
    //在线计算点 点在线上移动
    public calculatePointOnLine(lineA: Cesium.Cartesian3, lineB: Cesium.Cartesian3, range: number) {
        // 计算直线AB的向量表示
        const AB = new Cesium.Cartesian3(lineB.x - lineA.x, lineB.y - lineA.y, lineB.z - lineA.z);
        // 获取线段长度 
        const d = Cesium.Cartesian3.magnitude(AB);
        // 计算点的位置 
        const AB_unit = Cesium.Cartesian3.normalize(AB, new Cesium.Cartesian3()); // 表示AB方向的单位向量 
        const P_at_T = Cesium.Cartesian3.add(lineA, Cesium.Cartesian3.multiplyByScalar(AB_unit, 0.5 * d + range, new Cesium.Cartesian3()), new Cesium.Cartesian3());
        return P_at_T;
    }
    //3个点确定第四点
    public Get3to4Point(p1: Cesium.Cartesian3, p2: Cesium.Cartesian3, p3: Cesium.Cartesian3) {
        //求出对角线的中点m
        const m = {
            x: (p1.x + p3.x) / 2,
            y: (p1.y + p3.y) / 2,
            z: (p1.z + p3.z) / 2
        };
        //求出p4的坐标
        const p4 = {
            x: 2 * m.x - p2.x,
            y: 2 * m.y - p2.y,
            z: 2 * m.z - p2.z
        };
        //返回p4
        return new Cesium.Cartesian3(p4.x, p4.y, p4.z);
    }
    //计算旋转弧度
    public GetComputeRadian(P1: Cesium.Cartesian3, center: Cesium.Cartesian3, P2: Cesium.Cartesian3, axial: Cesium.Cartesian3) {
        // this.OWOP.position = P1;
        // this.TWOP.position = P2;
        const AB = Cesium.Cartesian3.subtract(P1, center, new Cesium.Cartesian3());
        const BC = Cesium.Cartesian3.subtract(P2, center, new Cesium.Cartesian3());
        const dotProduct = Cesium.Cartesian3.dot(AB, BC);
        const magnitudeAB = Cesium.Cartesian3.magnitude(AB);
        const magnitudeBC = Cesium.Cartesian3.magnitude(BC);
        const angle = Math.acos(dotProduct / (magnitudeAB * magnitudeBC));
        const crossProduct = Cesium.Cartesian3.cross(AB, BC, new Cesium.Cartesian3());
        const sign = Math.sign(Cesium.Cartesian3.dot(crossProduct, axial));
        const signedAngle = sign * angle;
        return signedAngle;
    }
    //旋转模型
    public RotationModel(offset: hprOffset) {
        this.offset = offset
        const Matrix = this.DefaultMatrix;
        const hpr = new Cesium.HeadingPitchRoll(offset.heading, offset.pitch, offset.roll);
        //Cesium.Matrix3.fromRotationY
        const RotationMatrix3 = Cesium.Matrix3.fromHeadingPitchRoll(hpr);
        const newTransform = Cesium.Matrix4.multiplyByMatrix3(Matrix, RotationMatrix3, new Cesium.Matrix4());
        this.tileset.root.transform = newTransform;
    }
    //旋转偏移量
    public GetOffsetRotationXYZ(ray: Cesium.Ray, axial: Cesium.Cartesian3) {
        const clickpoint = this.GetIntersectRayPlane(ray, axial);
        if (!clickpoint) return
        this.towlocalPostion = clickpoint;
        const offset = {
            heading: 0,
            pitch: 0,
            roll: 0
        }
        //物体中心点
        const center = Cesium.Matrix4.getTranslation(this.tileset.root.transform, new Cesium.Cartesian3());
        //计算弧度
        if (!this.onelocalPosition) return
        const radian = this.GetComputeRadian(this.onelocalPosition, center, this.towlocalPostion, axial);
        if (this.isRotationAxiszDrag) {
            offset.heading = -radian;
        }
        else if (this.isRotationAxisyDrag) {
            offset.pitch = -radian;
        }
        else if (this.isRotationAxisxDrag) {
            offset.roll = radian;
        }
        return offset;
    }

    //鼠标按下时间MouseDown
    public MobileHandleControlMouseDownEvent(movement: EventArgs) {
        if (!movement.position) return
        let picked = this.viewer.scene.pick(movement.position)
        if (!picked) return
        const pickedFeature = picked;
        // this.DefaultMatrix = this.tileset.root.transform;
        if (Cesium.defined(pickedFeature)) {
            //--------------------------------------------
            if (Cesium.defined(pickedFeature.id)) {
                this.viewer.scene.screenSpaceCameraController.enableZoom = false;
                this.viewer.scene.screenSpaceCameraController.enableRotate = false;
                this.viewer.scene.screenSpaceCameraController.enableTranslate = false;
                this.DefaultMatrix = this.tileset.root.transform;
                if (pickedFeature.id === "axisX") {
                    this.isAxisxDrag = true;
                }
                else if (pickedFeature.id === "axisY") {
                    this.isAxisyDrag = true;
                }
                else if (pickedFeature.id === "axisZ") {
                    this.isAxiszDrag = true;
                }
                else if (pickedFeature.id === "RotationAxisX") {
                    this.isRotationAxisxDrag = true;
                }
                else if (pickedFeature.id === "RotationAxisY") {
                    this.isRotationAxisyDrag = true;
                }
                else if (pickedFeature.id === "RotationAxisZ") {
                    this.isRotationAxiszDrag = true;
                }
                console.log(pickedFeature)
                this.Switchprimitive = pickedFeature.primitive;
                if (this.Switchprimitive) {
                    this.Switchprimitive.colorBlendMode = Cesium.ColorBlendMode.REPLACE;
                    this.Switchprimitive.color = Cesium.Color.YELLOW;
                    this.Switchprimitive.colorBlendAmount = 10;
                }
            }
        }
        const ray = this.viewer.camera.getPickRay(movement.position);
        if (!ray) return
        if (this.isAxisxDrag || this.isAxisyDrag) {
            const clickpoint = this.GetIntersectRayPlane(ray, this.axialz)
            //局部坐标
            if (!clickpoint) return
            const offset = this.GetLocalPosition(this.tileset.root.transform, clickpoint);

            this.onelocalPosition = offset;
        }
        else if (this.isAxiszDrag) {
            const clickpoint = this.GetIntersectRayPlane(ray, this.axialy)
            //局部坐标
            if (!clickpoint) return
            const offset = this.GetLocalPosition(this.tileset.root.transform, clickpoint);
            this.onelocalPosition = offset;
        }
        //点击旋转z轴
        else if (this.isRotationAxiszDrag) {
            const clickpoint = this.GetIntersectRayPlane(ray, this.axialz)
            if (!clickpoint) return
            this.onelocalPosition = clickpoint;
        }
        //点击旋转Y轴
        else if (this.isRotationAxisyDrag) {
            const clickpoint = this.GetIntersectRayPlane(ray, this.axialx)
            if (!clickpoint) return
            this.onelocalPosition = clickpoint;
        }
        //点击旋转x轴
        else if (this.isRotationAxisxDrag) {
            const clickpoint = this.GetIntersectRayPlane(ray, this.axialy)
            if (!clickpoint) return
            this.onelocalPosition = clickpoint;
        }
    }
    // MouseMove控制
    public MobileHandleControlMouseMoveEvent(movement: EventArgs) {
        if (!movement.endPosition) return
        const ray = this.viewer.camera.getPickRay(movement.endPosition);
        if (!ray) return
        // red:X;
        // green:Y;
        // blue:Z;
        if (this.isAxisxDrag) {
            const offset = this.GetOffsetTranslationXYZ(ray, this.axialx);
            if (!offset) return
            this.TranslationModel(offset);
            this.updateDrawArrow();
        }
        else if (this.isAxisyDrag) {
            const offset = this.GetOffsetTranslationXYZ(ray, this.axialy);
            if (!offset) return
            this.TranslationModel(offset);
            this.updateDrawArrow();
        }
        else if (this.isAxiszDrag) {
            const offset = this.GetOffsetTranslationXYZ(ray, this.axialz);
            if (!offset) return
            this.TranslationModel(offset);
            this.updateDrawArrow();
        }
        else if (this.isRotationAxiszDrag) {
            const offset = this.GetOffsetRotationXYZ(ray, this.axialz);
            if (!offset) return
            this.RotationModel(offset);
            this.updateDrawArrow();
        }
        else if (this.isRotationAxisyDrag) {
            const offset = this.GetOffsetRotationXYZ(ray, this.axialx);
            if (!offset) return
            this.RotationModel(offset);
            this.updateDrawArrow();
        }
        else if (this.isRotationAxisxDrag) {
            const offset = this.GetOffsetRotationXYZ(ray, this.axialy);
            if (!offset) return
            this.RotationModel(offset);
            this.updateDrawArrow();
        }
    }
    // MouseUp鼠标抬起
    public MobileHandleControlMouseUpEvent(movement: EventArgs) {
        console.log("MouseUp", movement)
        if (this.Switchprimitive) {
            this.Switchprimitive.colorBlendMode = Cesium.ColorBlendMode.MIX;
            this.Switchprimitive.color = Cesium.Color.YELLOW;
            this.Switchprimitive.colorBlendAmount = 0;
        }
        this.isAxisxDrag = false;
        this.isAxisyDrag = false;
        this.isAxiszDrag = false;
        this.isRotationAxisxDrag = false;
        this.isRotationAxisyDrag = false;
        this.isRotationAxiszDrag = false;
    }

    // 添加鼠标键盘事件
    public CreatEvent() {
        //鼠标按下
        const callbackLDID = this.subscriber.addExternal((movement: EventArgs) => {
            this.MobileHandleControlMouseDownEvent(movement);
        }, "LEFT_DOWN");
        this.callbacks.push(callbackLDID);

        //鼠标弹起
        const callbackLUID = this.subscriber.addExternal((movement: EventArgs) => {
            this.MobileHandleControlMouseUpEvent(movement);
            this.viewer.scene.screenSpaceCameraController.enableZoom = true;
            this.viewer.scene.screenSpaceCameraController.enableRotate = true;
            this.viewer.scene.screenSpaceCameraController.enableTranslate = true;
        }, "LEFT_UP");
        this.callbacks.push(callbackLUID);

        //鼠标移动
        const callbackMMID = this.subscriber.addExternal((movement: EventArgs) => {
            this.MobileHandleControlMouseMoveEvent(movement);
        }, "MOUSE_MOVE");
        this.callbacks.push(callbackMMID);

        this.viewer.scene.postUpdate.addEventListener(() => {
        });
        document.addEventListener('keydown', this.keydownControl.bind(this));
        document.addEventListener('keyup', this.keyupControl.bind(this));
    }
    public keyupControl(event: KeyboardEvent) {
        var ctrlKey = event.ctrlKey || event.metaKey;
        var keyCode = event.keyCode || event.which || event.charCode;
        if (!ctrlKey && keyCode === 17) {
            console.log("ctrl抬起", event)
            // 取消高亮
            if (this.Switchprimitive) {
                this.Switchprimitive.colorBlendMode = Cesium.ColorBlendMode.MIX;
                this.Switchprimitive.color = Cesium.Color.YELLOW;
                this.Switchprimitive.colorBlendAmount = 0;
                this.isHighlight = false;
            }
        }
    }
    public keydownControl(event: KeyboardEvent) {
        // 获取按下的键码
        var keyCode = event.keyCode || event.which || event.charCode;
        let _this = this
        var ctrlKey = event.ctrlKey || event.metaKey;
        if (ctrlKey) {
            switch (keyCode) {
                case 37:
                    this.Switchprimitive = this.prevModel();
                    console.log(this.modelIndex)
                    if (this.Switchprimitive) {
                        this.Switchprimitive.colorBlendMode = Cesium.ColorBlendMode.REPLACE;
                        this.Switchprimitive.color = Cesium.Color.YELLOW;
                        this.Switchprimitive.colorBlendAmount = 10;
                        this.isHighlight = true;
                        // if (this.modelIndex === 0) {
                        //     this.modelIndex = 5
                        //     console.log("0", this.modelIndex)
                        //     let oldPrimitive = this.modelArray[1] as Cesium.Model
                        //     if (oldPrimitive) {
                        //         oldPrimitive.colorBlendMode = Cesium.ColorBlendMode.MIX;
                        //         oldPrimitive.color = Cesium.Color.YELLOW;
                        //         oldPrimitive.colorBlendAmount = 0;
                        //     }
                        // } else {
                        //     this.modelIndex--;
                        //     console.log("--", this.modelIndex)
                        //     let oldPrimitive = this.modelArray[this.modelIndex + 2] as Cesium.Model
                        //     if (oldPrimitive) {
                        //         oldPrimitive.colorBlendMode = Cesium.ColorBlendMode.MIX;
                        //         oldPrimitive.color = Cesium.Color.YELLOW;
                        //         oldPrimitive.colorBlendAmount = 0;
                        //     }
                        // }
                    }
                    // 方案一：
                    // 获取模型中心对应的屏幕坐标当做startPosition
                    // 加固定像素比例，为endPosition
                    // 模拟滑动，触发
                    // this.MobileHandleControlMouseMoveEvent()
                    break;
                case 38:
                    // 方案二：
                    // 获取屏幕当前比例尺 DistanceL
                    // 获取xyz的移动向量 offset = new Cesium.Cartesian3(DistanceL, 0, 0);
                    // 再直接调用
                    // this.TranslationModel(offset);
                    // this.updateDrawArrow();
                    if (this.Switchprimitive && this.isHighlight) {
                        this.handleKeyboardControl(this.Switchprimitive.id, true)
                    }
                    break;
                case 39:
                    this.Switchprimitive = this.nextModel();
                    if (this.Switchprimitive) {
                        this.Switchprimitive.colorBlendMode = Cesium.ColorBlendMode.REPLACE;
                        this.Switchprimitive.color = Cesium.Color.YELLOW;
                        this.Switchprimitive.colorBlendAmount = 10;
                        this.isHighlight = true;
                    }
                    break;
                case 40:
                    if (this.Switchprimitive && this.isHighlight) {
                        this.handleKeyboardControl(this.Switchprimitive.id, false)
                    }
                    break;
                default:
                    console.log('ctrl + 其他');
                    break;
            }
        } else {
            switch (keyCode) {
                case 82:
                    console.log('R键');
                    _this.showRotationCollection = !_this.showRotationCollection
                    _this.showRotationAxishandler(_this.showRotationCollection)
                    if (!_this.showAxialCollection && !_this.showRotationCollection) {
                        _this.showAxialCollection = true
                        _this.showMoveAxishandler(_this.showAxialCollection)
                    }
                    this.filterModelArray(this.showAxialCollection, this.showRotationCollection)
                    break;
                case 83:
                    console.log('S键');
                    break;
                case 84:
                    console.log('T键');
                    _this.showAxialCollection = !_this.showAxialCollection
                    _this.showMoveAxishandler(_this.showAxialCollection)
                    if (!_this.showAxialCollection && !_this.showRotationCollection) {
                        _this.showRotationCollection = true;
                        _this.showRotationAxishandler(_this.showRotationCollection)
                    }
                    this.filterModelArray(this.showAxialCollection, this.showRotationCollection)
                    break;
                default:
                    console.log('其他键被按下');
                    break;
            }
        }

    }
    private nextModel() {
        const value = this.modelArray[this.modelIndex];
        let oldIndex = this.modelIndex === 0 ? this.modelArray.length - 1 : this.modelIndex - 1;
        this.modelIndex = (this.modelIndex + 1) % this.modelArray.length;
        let oldPrimitive = this.modelArray[oldIndex] as Cesium.Model
        if (oldPrimitive) {
            oldPrimitive.colorBlendMode = Cesium.ColorBlendMode.MIX;
            oldPrimitive.color = Cesium.Color.YELLOW;
            oldPrimitive.colorBlendAmount = 0;
        }
        return value;
    }
    private prevModel() {
        let oldIndex = this.modelIndex
        this.modelIndex = this.modelIndex === 0 ? this.modelArray.length - 1 : this.modelIndex - 1;
        let oldPrimitive = this.modelArray[oldIndex] as Cesium.Model
        if (oldPrimitive) {
            oldPrimitive.colorBlendMode = Cesium.ColorBlendMode.MIX;
            oldPrimitive.color = Cesium.Color.YELLOW;
            oldPrimitive.colorBlendAmount = 0;
        }
        return this.modelArray[this.modelIndex];
    }
    public filterModelArray(showAxialCollection: boolean, showRotationCollection: boolean) {
        if (this.axialxPrimitive && this.axialyPrimitive && this.axialzPrimitive && this.rotationAxialxPrimitive && this.rotationAxialyPrimitive && this.rotationAxialzPrimitive)
            if (showAxialCollection && showRotationCollection) {
                this.modelArray = [this.axialxPrimitive, this.axialyPrimitive, this.axialzPrimitive, this.rotationAxialxPrimitive, this.rotationAxialyPrimitive, this.rotationAxialzPrimitive]
            } else if (!showAxialCollection && showRotationCollection) {
                this.modelArray = [this.rotationAxialxPrimitive, this.rotationAxialyPrimitive, this.rotationAxialzPrimitive]
            } else if (showAxialCollection && !showRotationCollection) {
                this.modelArray = [this.axialxPrimitive, this.axialyPrimitive, this.axialzPrimitive]
            }
        this.modelIndex = 0
    }
    public getPixeSize() {
        const scene = this.viewer.scene
        // 获取相机高度
        const cameraHeight = scene.camera.positionCartographic.height;
        console.log("相机高度", cameraHeight)
        const scale = (cameraHeight / 10).toFixed(0)
        return scale;
    }
    private handleKeyboardControl(name: string, isUp: boolean) {
        let offset = new Cesium.Cartesian3(0, 0, 0);
        let s = Number(this.getPixeSize())
        let distance = isUp ? s : -s
        let hpr = this.offset
        console.log(this.offset)
        let radian = Cesium.Math.toRadians(10);

        switch (name) {
            case 'axisX':
                console.log('X');
                offset = new Cesium.Cartesian3(distance, 0, 0);
                // 再直接调用
                this.TranslationModel(offset);
                this.updateDrawArrow();
                break;
            case 'axisY':
                console.log('Y');
                offset = new Cesium.Cartesian3(0, distance, 0);
                // 再直接调用
                this.TranslationModel(offset);
                this.updateDrawArrow();
                break;
            case 'axisZ':
                console.log('Z');
                offset = new Cesium.Cartesian3(0, 0, distance);
                // 再直接调用
                this.TranslationModel(offset);
                this.updateDrawArrow();
                break;
            case 'RotationAxisX':
                console.log('RotationAxisX');
                hpr.roll = isUp ? hpr.roll + radian : hpr.roll - radian;
                this.RotationModel(hpr);
                this.updateDrawArrow();

                break;
            case 'RotationAxisY':
                console.log('RotationAxisY');
                hpr.pitch = isUp ? hpr.pitch + radian : hpr.pitch - radian;;
                this.RotationModel(hpr);
                this.updateDrawArrow();
                break;
            case 'RotationAxisZ':
                console.log('RotationAxisZ');
                hpr.heading = isUp ? hpr.heading + radian : hpr.heading - radian;;
                this.RotationModel(hpr);
                this.updateDrawArrow();
                break;
        }
    }

    public destroy() {
        this.subscriber.removeExternal(this.callbacks);
        this.viewer.scene.primitives.remove(this.AxialprimitivesCollection);
        this.viewer.scene.primitives.remove(this.RotationAxialprimitivesCollection);
        document.removeEventListener('keydown', this.keydownControl);
        document.removeEventListener('keyup', this.keyupControl);
    }
}
