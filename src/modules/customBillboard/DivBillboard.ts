/* eslint-disable */
import { Cartesian3, Cartesian2, Viewer, SceneTransforms } from "cesium";
import { createApp, h } from "vue";
/**
 * 创建一个DivBillboard

 */
class DivBillboard {
    protected viewer: Viewer;
    protected position: Cartesian3;
    protected content: string;
    private id: string;
    private element: HTMLElement | undefined;
    private maxRenderDis: number = 500000;
    private show: boolean;
    private vueComponent: any;
    private enableMouse: boolean

    /**
     * 
     * @param viewer Viewer
     * @param position Cartesian3
     * @param content string HTMLElement的string
     * @param vueComponent vue组件
     * @param enableMouse 是否允许鼠标事件
     */
    constructor(viewer: Viewer, position: Cartesian3, content: string, vueComponent: any, enableMouse?: boolean) {
        this.viewer = viewer;
        this.position = position;
        this.content = content;
        this.vueComponent = vueComponent;
        this.enableMouse = enableMouse || false
        this.maxRenderDis =
            Math.round(viewer.camera.positionCartographic.height) * 5;
        this.id = new Date().getTime().toString();
        this.show = true;
        this.initBillboard();
    }

    private initBillboard() {
        this.element = document.createElement("div");
        this.element.style.position = "absolute";
        if (this.enableMouse) {
            this.element.style.pointerEvents = "auto";
        } else {
            this.element.style.pointerEvents = "none";
        }
        // 创建 Vue 应用实例并挂载到这个 DOM 元素上
        const app = createApp({
            render: () => h(this.vueComponent, { id: this.id, htmlContent: this.content })
        });
        app.mount(this.element);
        this.viewer.cesiumWidget.container.appendChild(this.element);
        //实时更新位置
        this.viewer.scene.postRender.addEventListener(
            this.updateBillboardLocation,
            this
        );
    }
    private updateBillboardLocation() {
        if (this.element) {
            const canvasHeight = this.viewer.scene.canvas.height;
            const windowPosition = new Cartesian2();
            SceneTransforms.wgs84ToWindowCoordinates(
                this.viewer.scene,
                this.position,
                windowPosition
            );
            this.element.style.bottom = canvasHeight - windowPosition.y + "px";
            const elWidth = this.element.offsetWidth;
            this.element.style.left = windowPosition.x - elWidth / 2 + "px";
            this.element.style.transformStyle = 'preserve-3d';


            const camerPosition = this.viewer.camera.position;
            let height =
                this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
                    camerPosition
                ).height;
            height += this.viewer.scene.globe.ellipsoid.maximumRadius;
            if (this.show) {
                if (
                    !(Cartesian3.distance(camerPosition, this.position) > height) &&
                    this.viewer.camera.positionCartographic.height < this.maxRenderDis
                ) {
                    this.element.style.display = "block";
                    let scale = this.maxRenderDis / (Cartesian3.distance(camerPosition, this.position) * 5);
                    if(scale > 1){
                        scale = 1
                    }
                    this.element.style.transform = `scale(${scale})`;

                } else {
                    this.element.style.display = "none";
                }
            } else {
                this.element.style.display = "none";
            }
        }
    }
    public setContent(content: string) {
        this.content = content;
        if (this.element) {
            const app = createApp({
                render: () => h(this.vueComponent, { id: this.id, htmlContent: this.content })
            });
            app.mount(this.element); // 重新渲染组件
        }
    }
    public destroy() {
        if (this.element) {
            this.viewer.scene.postRender.removeEventListener(this.updateBillboardLocation.bind(this));
            this.viewer.cesiumWidget.container.removeChild(this.element);
            this.element = null;
        }
    }
}
export default DivBillboard;