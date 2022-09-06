import { DOMElementRotator } from "./domElementRotator";
import { DragManager } from "./dragManager";

export class RotationControlManager {
  #selector;
  #rotator;
  #onMouseDownHandlerBind;
  #onDragRotationHandlerBind;
  #dragManager;

  /**
   * @param {keyof HTMLElementTagNameMap} selector
   */
  constructor(selector) {
    this.#selector = selector;
    const element = document.querySelector(this.#selector);
    this.#rotator = new DOMElementRotator(element);
    this.#onMouseDownHandlerBind = this.#onMouseDownHandler.bind(this);
    this.#onDragRotationHandlerBind = this.#onDragRotationHandler.bind(this);
    this.#dragManager = new DragManager(
      this.#onDragRotationHandlerBind,
      this.#onMouseDownHandlerBind,
      element
    );
  }

  /**
   * @param {{
   *    event: MouseEvent,
   *    target: EventTarget
   * }} mouseData
   */
  #onMouseDownHandler(mouseData) {
    if (
      mouseData.target.closest(this.#selector) !== this.#rotator.getElement()
    ) {
      mouseData.event.preventDefault();
    }
  }

  /**
   * @param {{
   *    movementX: number,
   *    movementY: number,
   *    x: number,
   *    y: number,
   *    buttons: number,
   *    event: MouseEvent
   * }} mouseData
   */
  #onDragRotationHandler(mouseData) {
    let x, y, z;
    const [mX, mY] = [mouseData.movementX, mouseData.movementY];

    if (mouseData.buttons === 1) {
      [x, y, z] = [mX, mY, 0];
    }

    this.#rotator.rotateXYZ(x, y, z);
  }
}
