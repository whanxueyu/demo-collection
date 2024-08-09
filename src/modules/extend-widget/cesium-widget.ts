import type { Viewer } from "cesium";

class CesiumWidget {
  protected _viewer: Viewer;
  protected _ready: boolean;
  protected _container: HTMLElement;
  protected _enabled: boolean;

  constructor(viewer: Viewer, container: HTMLElement) {
    this._viewer = viewer;
    this._container = container;
    this._ready = false;
    this._enabled = false;
  }

  set enabled(enable: boolean) {
    this._enabled = enable;
    this._enableHook();
  }

  get enabled() {
    return this._enabled;
  }

  /**
   * mount content
   */
  protected _mountContent() {}

  /**
   * binds event
   */
  protected _bindEvent() {}

  /**
   * Unbinds event
   */
  protected _unbindEvent() {}

  /**
   * Setting widget content
   * @param content
   * @returns {Widget}
   */
  setContent(content: string | Element): CesiumWidget {
    if (content && typeof content === "string") {
      this._container.innerHTML = content;
    } else if (content && content instanceof Element) {
      while (this._container.hasChildNodes()) {
        if (this._container.firstChild)
          this._container.removeChild(this._container.firstChild);
      }
      this._container.appendChild(content);
    }
    return this;
  }

  /**
   * When enable modifies the hook executed, the subclass copies it as required
   * @private
   */
  private _enableHook() {
    if (!this._ready) {
      this._mountContent();
    }
    if(this._enabled)
    {
        if (!this._container.parentNode) this._viewer.container.appendChild(this._container);
        this._bindEvent();
    }
    else{
        this._unbindEvent();
        if (this._container.parentNode) this._viewer.container.removeChild(this._container);
    }
  }

  /**
   * hide widget
   */
  hide() {
    if (this._container) this._container.style.display = "none";
  }

  /**
   * show widget
   */
  show() {
    if (this._container) this._container.style.display = "block";
  }

  destroy() {
    this.enabled = false;
    this._ready = false;
  }
}

export default CesiumWidget;
