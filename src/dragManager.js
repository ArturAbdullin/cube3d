export class DragManager {
  #active;
  #dragSensitivity;
  #onMouseDownCallback;
  #onDragCallback;
  #onMouseMoveHandlerBind;
  #onMouseDownHandlerBind;
  #onMouseUpHandlerBind;

  /**
   *
   * @param {(mouseData: {}) => void} dragCallback
   * @param {(mouseData: {}) => void} mouseDownCallback
   */
  constructor(dragCallback, mouseDownCallback) {
    this.#active = false;
    this.#dragSensitivity = 1 / 200;
    this.#onMouseDownCallback = mouseDownCallback;
    this.#onDragCallback = dragCallback;
    this.#onMouseMoveHandlerBind = this.#onMouseMoveHandler.bind(this);
    this.#onMouseDownHandlerBind = this.#onMouseDownHandler.bind(this);
    this.#onMouseUpHandlerBind = this.#onMouseUpHandler.bind(this);
    this.activate();
  }

  #onMouseDownHandler(event) {
    this.#onMouseDownCallback({
      event: event,
      target: event.target,
    });

    if (event.defaultPrevented) return;

    document.addEventListener("mousemove", this.#onMouseMoveHandlerBind);
  }

  #onMouseUpHandler() {
    document.removeEventListener("mousemove", this.#onMouseMoveHandlerBind);
  }

  #onMouseMoveHandler(event) {
    this.#onDragCallback({
      movementX: event.movementX * this.#dragSensitivity,
      movementY: event.movementY * this.#dragSensitivity,
      x: event.x,
      y: event.y,
      buttons: event.buttons,
      event: event,
    });
  }

  get isActive() {
    return this.#active;
  }

  activate() {
    document.addEventListener("mousedown", this.#onMouseDownHandlerBind);
    document.addEventListener("mouseup", this.#onMouseUpHandlerBind);
    this.#active = true;
  }

  destroy() {
    document.removeEventListener("mosemove", this.#onMouseMoveHandlerBind);
    document.removeEventListener("mousedown", this.#onMouseDownHandlerBind);
    document.removeEventListener("mouseup", this.#onMouseUpHandlerBind);
    this.#active = false;
  }
}
