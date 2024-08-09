import * as Cesium from "cesium";
import {defined} from "cesium";
import DomUtil from "@/hooks/dom-functions";
import CesiumWidget from "../extend-widget/cesium-widget";
import "./styles/status-bar.scss";

export interface StatusBarControllerProps {
  container?: Element;
  company?: string;
}

class CesiumStatusBar extends CesiumWidget {
  private _lonEl!: HTMLElement;
  private _latEl!: HTMLElement;
  private _altEl!: HTMLElement;

  private _cameraHeight!: HTMLElement;
  private _mapLevel!: HTMLElement;

  private _company: string;
  private _mouseEventHandler?: Cesium.ScreenSpaceEventHandler;

  constructor(viewer: Cesium.Viewer, options: StatusBarControllerProps = {}) {
    super(
      viewer,
      DomUtil.create(
        "div",
        "cesium-status-controller",
        options.container ?? viewer.container
      )
    );
    this._company = options.company ?? "北京影来同创科技有限公司";
    this.enabled = true;
  }

   heightToLevel(altitude: number):number {
    // 粗略计算
    const A = 40487.57;
    const B = 0.00007096758;
    const C = 91610.74;
    const D = -40467.74;
  
    return Math.round(D + (A - D) / (1 + Math.pow(altitude / C, B)));
  }

  protected postRenderHandler() {
    let _heading: number = 0;
    if(defined(this._viewer.camera.heading))
    {
        _heading = Cesium.Math.toDegrees(this._viewer.camera.heading);
    }
    let _pitch: number = 0;
    if(defined(this._viewer.camera.pitch))
    {
        _pitch = Cesium.Math.toDegrees(this._viewer.camera.pitch);
    }
    let _roll: number = 0;
    if(defined(this._viewer.camera.roll))
    {
        _roll = Cesium.Math.toDegrees(this._viewer.camera.roll);
    }
    let _cameraheight: number = 0;
    if(defined(this._viewer.camera.positionCartographic.height))
    {
        _cameraheight = this._viewer.camera.positionCartographic.height;
    }
    let cameraInfo = {
      heading: Number(_heading.toFixed(2)),
      pitch: Number(_pitch.toFixed(2)),
      roll: Number(_roll.toFixed(2)),
      cameraheight: Number(_cameraheight.toFixed(2)),
      level: this.heightToLevel(_cameraheight).toFixed(0),
    };
    if (cameraInfo.cameraheight > 15000) {
      let _cameraHeight_Km = (cameraInfo.cameraheight / 1000.0).toFixed(2);
      this._cameraHeight.innerText = `${_cameraHeight_Km} Km`;
    } else {
      this._cameraHeight.innerText = `${cameraInfo.cameraheight} m`;
    }
    this._mapLevel.innerText = cameraInfo.level;
  }

  protected _bindEvent(): void {
    this._mouseEventHandler = new Cesium.ScreenSpaceEventHandler(
      this._viewer.scene.canvas
    );
    const mouseMove = (event: any) => {
      let ray = this._viewer.camera.getPickRay(event.endPosition);
      if (ray) {
        let cartesian = this._viewer.scene.globe.pick(ray, this._viewer.scene);
        if (cartesian) {
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          let lng = Cesium.Math.toDegrees(cartographic.longitude);
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          let alt = cartographic.height;
          let coordinate = {
            longitude: Number(lng.toFixed(6)),
            latitude: Number(lat.toFixed(6)),
            altitude: Number(alt.toFixed(2)),
          };
          this._lonEl.innerText = String(coordinate.longitude);
          this._latEl.innerText = String(coordinate.latitude);
          this._altEl.innerText = String(coordinate.altitude);
        } else {
          this._lonEl.innerText = "NAN";
          this._latEl.innerText = "NAN";
        }
      }
    };

    this._mouseEventHandler.setInputAction(
      mouseMove,
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    );
    this._viewer.scene.postRender.addEventListener(
      this.postRenderHandler,
      this
    );
  }

  protected _unbindEvent(): void {
    if (this._mouseEventHandler) {
      this._mouseEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );
      this._mouseEventHandler.destroy();
      this._mouseEventHandler = undefined;
      this._viewer.scene.postRender.removeEventListener(
        this.postRenderHandler,
        this
      );
    }
  }

  protected _mountContent(): void {
    //经度
    const LonLabel: HTMLElement = DomUtil.parseDom(
      "<lablel>经度:</lablel>",
      "label commonlabel"
    );
    this._lonEl = DomUtil.parseDom(
      "<lablel>103.64443</lablel>",
      "lonlat commonlabel"
    );
    this._container.appendChild(LonLabel);
    this._container.appendChild(this._lonEl);

    //纬度
    const LatLabel: HTMLElement = DomUtil.parseDom(
      "<lablel>纬度:</lablel>",
      "label commonlabel"
    );
    this._latEl = DomUtil.parseDom(
      "<lablel>45.45553</lablel>",
      "lonlat commonlabel"
    );

    this._container.appendChild(LatLabel);
    this._container.appendChild(this._latEl);

    //高度
    const AltLabel: HTMLElement = DomUtil.parseDom(
      "<lablel>海拔:</lablel>",
      "label commonlabel"
    );
    this._altEl = DomUtil.parseDom(
      "<lablel>100.45KM</lablel>",
      "lonlat commonlabel"
    );
    this._container.appendChild(AltLabel);
    this._container.appendChild(this._altEl);

    //相机高度
    const CameraHeightLabel: HTMLElement = DomUtil.parseDom(
      "<lablel>相机高度:</lablel>",
      "label commonlabel"
    );
    this._cameraHeight = DomUtil.parseDom(
      "<lablel>1000KM</lablel>",
      "cameraheight commonlabel"
    );
    this._container.appendChild(CameraHeightLabel);
    this._container.appendChild(this._cameraHeight);


    //地图等级
     const LevlLabel: HTMLElement = DomUtil.parseDom(
      "<lablel>地图级别:</lablel>",
      "label commonlabel"
    );
    this._mapLevel = DomUtil.parseDom(
      "<lablel>0</lablel>",
      "lonlat commonlabel"
    );
    this._container.appendChild(LevlLabel);
    this._container.appendChild(this._mapLevel);

    //公司信息
    const companyLabel: HTMLElement = DomUtil.parseDom(
      "<lablel>北京影来同创科技有限公司</lablel>",
      "company commonlabel"
    );
    companyLabel.innerText = this._company ?? "北京影来同创科技有限公司";
    this._container.appendChild(companyLabel);
  }
}

export default CesiumStatusBar;
