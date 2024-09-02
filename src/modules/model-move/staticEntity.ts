import * as Cesium from 'cesium'
import radaeScanMaterial from "@/modules/material/radaeScanMaterial";
type Point = {
    longitude: number,
    latitude: number,
    height: number,
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

class StaticEntity {
    private viewer: Cesium.Viewer;
    private position: Point;
    private modeleEntity: Cesium.Entity;
    private panelEntity: Cesium.Entity;
    private modelPath: string;
    private modelName: string;
    public modelId: string;
    private iconPath: string;
    private type: string
    protected radar?: any;
    private clampGround?: boolean;

    constructor(viewer: Cesium.Viewer, option: ModelStaticOption) {
        this.viewer = viewer;
        this.modelPath = option.modelPath;
        this.iconPath = option.iconPath;
        this.modelName = option.name;
        this.modelId = option.id;
        this.position = option.position;
        this.type = option.type;
        this.clampGround = option.clampGround !== undefined ? Boolean(option.clampGround) : false;
        this.addModel();
    }
    public get ModeleEntity(): Cesium.Entity {
        return this.modeleEntity
    }
    private addModel = () => {
        if (this.type === 'radar') {
            // this.radar = new window.CesiumEMGEExtensions.EV_ParseArrayRadar({
            //     viewer: this.viewer,
            //     position: Cesium.Cartesian3.fromDegrees(this.position.longitude, this.position.latitude, this.position.height),
            //     radius: 88000,
            //     color: new Cesium.Color(0.5, 0.5, 1.0, 0.1),
            //     lineColor: new Cesium.Color(0.2, 0.5, 0.5, 0.5),
            //     showScan: true,
            // });
            var circleGeometry = new Cesium.CircleGeometry({
                center: Cesium.Cartesian3.fromDegrees(this.position.longitude, this.position.latitude, this.position.height),
                radius: 2000.0,
                vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
              })
              var instance = new Cesium.GeometryInstance({
                geometry: circleGeometry,
              })
              this.radar = this.viewer.scene.primitives.add(
                new Cesium.GroundPrimitive({
                  geometryInstances: instance,
                  appearance: new Cesium.MaterialAppearance({
                    material: radaeScanMaterial(new Cesium.Color(0.0, 1.0, 0.0)),
                  }),
                })
              )
            this.modeleEntity = this.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(this.position.longitude, this.position.latitude, this.position.height),
                // 模型数据
                model: {
                    uri: this.modelPath,
                    color: undefined,
                    colorBlendMode: undefined,
                    colorBlendAmount: undefined,
                    silhouetteColor: Cesium.Color.fromCssColorString('#00ff00'),
                    silhouetteSize: 0,
                    heightReference: this.clampGround ? Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.RELATIVE_TO_GROUND
                },
            });
        } else if (this.type === 'poi') {
            this.modeleEntity = this.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(this.position.longitude, this.position.latitude, this.position.height),
                billboard: {
                    image: this.iconPath,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1000000),
                    scale: 1.0,
                },
                label: {
                    text: `${this.modelName}`,
                    font: '16px sans-serif',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    pixelOffset: new Cesium.Cartesian2(0, -40),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1000000),
                },
            });
        } else if (this.type === 'model') {
            this.modeleEntity = this.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(this.position.longitude, this.position.latitude, this.position.height),
                model: {
                    uri: this.modelPath,
                    minimumPixelSize: 128,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000),
                    color: undefined,
                    colorBlendMode: undefined,
                    colorBlendAmount: undefined,
                    silhouetteColor: Cesium.Color.fromCssColorString('#00ff00'),
                    silhouetteSize: 0,
                    scale: 2.5,
                    // heightReference: Cesium.HeightReference.NONE
                    heightReference: this.clampGround ? Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.NONE
                },
            });
            this.panelEntity = this.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(this.position.longitude, this.position.latitude, this.position.height),
                parent: this.ModeleEntity,
                model: {
                    uri: this.iconPath,
                    minimumPixelSize: 64,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(200000, Infinity),
                    // heightReference: this.clampGround ? Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.NONE
                },
            })
        } else if (this.type === 'military') {
            this.modeleEntity = this.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(this.position.longitude, this.position.latitude, this.position.height),
                billboard: {
                    image: this.iconPath,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(41000, Infinity),
                    scale: 15.0,
                    // height: 76,
                    // width: 110,
                    sizeInMeters: true

                },
                // label: {
                //     text: `${this.modelName}`,
                //     font: '16px sans-serif',
                //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                //     pixelOffset: new Cesium.Cartesian2(0, -40),
                //     horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                //     disableDepthTestDistance: Number.POSITIVE_INFINITY,
                //     distanceDisplayCondition: new Cesium.DistanceDisplayCondition(25000, Infinity),
                // },
            });
        }

        // this.createAndTrackPanel(this.modeleEntity)
    }

    public hightLight = (val: boolean) => {
        if (val) {
            this.modeleEntity.model.silhouetteSize = new Cesium.ConstantProperty(4);
            this.panelEntity.label.fillColor = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString('#00ff00'));
            this.modeleEntity.model.color = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString('#00ff00'));
            this.modeleEntity.model.colorBlendMode = new Cesium.ConstantProperty(Cesium.ColorBlendMode.HIGHLIGHT);
            this.modeleEntity.model.colorBlendAmount = new Cesium.ConstantProperty(0.5);
        } else {
            this.modeleEntity.model.silhouetteSize = new Cesium.ConstantProperty(0);
            this.panelEntity.label.fillColor = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString('#ffffff'));
            this.modeleEntity.model.color = undefined;
            this.modeleEntity.model.colorBlendMode = undefined;
            this.modeleEntity.model.colorBlendAmount = undefined
        }
    }

    public handlePanelShow = (show: boolean) => {
        this.panelEntity.show = show
    }

    public destroy = () => {
        this.viewer.entities.remove(this.modeleEntity)
        this.viewer.entities.remove(this.panelEntity)
        this.radar?.destroy()
    }
}
export default StaticEntity;