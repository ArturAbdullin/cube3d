/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/originManager.js
class OriginManager {
  #origin;

  /**
   *
   * @param {number[]} origin a 1x9 array that is a flatten 3x3 matrix
   */
  constructor(origin) {
    if (origin === undefined) {
      this.#origin = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    } else {
      this.#origin = origin;
    }
  }

  /**
   *
   * @returns {number[]} a 1x9 array that is a flatten 3x3 matrix
   */
  getOrigin() {
    return this.#origin;
  }

  /**
   * reset to [1, 0, 0, 0, 1, 0, 0, 0, 1]
   */
  resetOrigin() {
    this.#origin = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }

  /**
   * vector [x, y, z], angle [rad]
   * @param {number[]} vector
   * @param {number} angle
   */
  rotate(vector, angle) {
    const [x, y, z] = vector;
    const [xx, yy, zz, xy, xz, yz] = [x * x, y * y, z * z, x * y, x * z, y * z];

    // cos(a)
    const ca = Math.cos(angle);
    // 1 - cos(a)
    const ca1 = 1 - ca;
    // sin(a)
    const sa = Math.sin(angle);
    // 1 - sin(a)
    const sa1 = 1 - sa;

    // rotMatrix - 1x9 array; matrix[r][c] = array[c + r * 3]
    const rotMatrix = [
      xx * ca1 + ca,
      xy * ca1 - z * sa,
      xz * ca1 + y * sa,
      xy * ca1 + z * sa,
      yy * ca1 + ca,
      yz * ca1 - x * sa,
      xz * ca1 - y * sa,
      yz * ca1 + x * sa,
      zz * ca1 + ca,
    ];

    const m11 =
      rotMatrix[0] * this.#origin[0] +
      rotMatrix[1] * this.#origin[3] +
      rotMatrix[2] * this.#origin[6];
    const m12 =
      rotMatrix[0] * this.#origin[1] +
      rotMatrix[1] * this.#origin[4] +
      rotMatrix[2] * this.#origin[7];
    const m13 =
      rotMatrix[0] * this.#origin[2] +
      rotMatrix[1] * this.#origin[5] +
      rotMatrix[2] * this.#origin[8];
    const m21 =
      rotMatrix[3] * this.#origin[0] +
      rotMatrix[4] * this.#origin[3] +
      rotMatrix[5] * this.#origin[6];
    const m22 =
      rotMatrix[3] * this.#origin[1] +
      rotMatrix[4] * this.#origin[4] +
      rotMatrix[5] * this.#origin[7];
    const m23 =
      rotMatrix[3] * this.#origin[2] +
      rotMatrix[4] * this.#origin[5] +
      rotMatrix[5] * this.#origin[8];
    const m31 =
      rotMatrix[6] * this.#origin[0] +
      rotMatrix[7] * this.#origin[3] +
      rotMatrix[8] * this.#origin[6];
    const m32 =
      rotMatrix[6] * this.#origin[1] +
      rotMatrix[7] * this.#origin[4] +
      rotMatrix[8] * this.#origin[7];
    const m33 =
      rotMatrix[6] * this.#origin[2] +
      rotMatrix[7] * this.#origin[5] +
      rotMatrix[8] * this.#origin[8];

    this.#origin = [m11, m12, m13, m21, m22, m23, m31, m32, m33];
  }

  /**
   *
   * @param {number} angle [rad]
   */
  rotateX(angle) {
    this.rotate([-1, 0, 0], angle);
  }

  /**
   *
   * @param {number} angle [rad]
   */
  rotateY(angle) {
    this.rotate([0, 1, 0], angle);
  }

  /**
   *
   * @param {number} angle [rad]
   */
  rotateZ(angle) {
    this.rotate([0, 0, 1], angle);
  }

  /**
   *
   * @param {"up" | "down" | "left" | "right" | "clockwise" | "counterclockwise"} direction
   * @param {number} angle [rad]
   */
  turn(direction, angle) {
    switch (direction) {
      case "up":
        this.rotate([1, 0, 0], angle);
        break;
      case "down":
        this.rotate([1, 0, 0], -angle);
        break;
      case "left":
        this.rotate([0, 1, 0], -angle);
        break;
      case "right":
        this.rotate([0, 1, 0], angle);
        break;
      case "clockwise":
        this.rotate([0, 0, 1], angle);
        break;
      case "counterclockwise":
        this.rotate([0, 0, 1], -angle);
        break;
    }
  }
}

;// CONCATENATED MODULE: ./src/domElementRotator.js


class DOMElementRotator {
  #domElement;
  #originManager;
  #turnAngle;

  /**
   *
   * @param {Element} domElement
   */
  constructor(domElement) {
    this.#domElement = domElement;
    this.#originManager = new OriginManager();
    this.#turnAngle = Math.PI / 2;
  }

  /**
   * @returns {Element} DOM Element
   */
  getElement() {
    return this.#domElement;
  }

  /**
   * get coordinates of an element's center
   * @returns {{x: number, y: number}} an object with x and y properties
   */
   getElementCenterCoordinates() {
    const rect = this.#domElement.getBoundingClientRect();
    return {
      x: rect.left + document.body.scrollLeft + rect.width / 2,
      y: rect.top + document.body.scrollTop + rect.height / 2,
    };
  }

  /**
   * get a homogeneous coordinates matrix in the form of an element.style.transform property
   */
  get #matrix3d() {
    let array = this.#originManager.getOrigin();
    return `matrix3d(${array[0]}, ${array[3]}, ${array[6]}, 0, ${array[1]}, ${array[4]}, ${array[7]}, 0, ${array[2]}, ${array[5]}, ${array[8]}, 0, 0, 0, 0, 1)`;
  }

  /**
   * update a DOM element style.transform property
   */
  #updateView() {
    this.#domElement.style.transform = this.#matrix3d;
  }

  /**
   * rotate an element by a given angle around a given vector
   * @param {number[]} vector [x, y, z]
   * @param {number} angle [rad]
   */
  rotateAngle(vector, angle) {
    this.#originManager.rotate(vector, angle);
    this.#updateView();
  }

  /**
   * rotate an element around x, y, z vectors by a given angles
   * @param {number} x [rad]
   * @param {number} y [rad]
   * @param {number} z [rad]
   */
  rotateXYZ(x, y, z) {
    this.#originManager.rotateX(y);
    this.#originManager.rotateY(x);
    this.#originManager.rotateZ(z);
    this.#updateView();
  }

  /**
   * reset origin to [1, 0, 0, 0, 1, 0, 0, 0, 1]
   */
  resetOrigin() {
    this.#originManager.resetOrigin();
    this.#updateView();
  }
}

;// CONCATENATED MODULE: ./src/dragManager.js
class DragManager {
  #active;
  #domElement
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
   * @param {Element} domElement
   */
  constructor(dragCallback, mouseDownCallback, domElement) {
    this.#active = false;
    this.#dragSensitivity = 1 / 200;
    this.#onMouseDownCallback = mouseDownCallback;
    this.#onDragCallback = dragCallback;
    this.#onMouseMoveHandlerBind = this.#onMouseMoveHandler.bind(this);
    this.#onMouseDownHandlerBind = this.#onMouseDownHandler.bind(this);
    this.#onMouseUpHandlerBind = this.#onMouseUpHandler.bind(this);
    this.#domElement = domElement;
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
    this.#domElement.addEventListener("mousedown", this.#onMouseDownHandlerBind);
    document.addEventListener("mouseup", this.#onMouseUpHandlerBind);
    this.#active = true;
  }

  destroy() {
    document.removeEventListener("mosemove", this.#onMouseMoveHandlerBind);
    this.#domElement.removeEventListener("mousedown", this.#onMouseDownHandlerBind);
    document.removeEventListener("mouseup", this.#onMouseUpHandlerBind);
    this.#active = false;
  }
}

;// CONCATENATED MODULE: ./src/rotationControlManager.js



class RotationControlManager {
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
    } else if (mouseData.buttons === 4) {
      const elemCenter = this.#rotator.getElementCenterCoordinates();
      if (mouseData.x > elemCenter.x && mouseData.y < elemCenter.y) {
        z = mY + mX;
      } else if (mouseData.x < elemCenter.x && mouseData.y < elemCenter.y) {
        z = -mY + mX;
      } else if (mouseData.x < elemCenter.x && mouseData.y > elemCenter.y) {
        z = -mY - mX;
      } else if (mouseData.x > elemCenter.x && mouseData.y > elemCenter.y) {
        z = mY - mX;
      }
      [x, y] = [0, 0];
    } else {
      [x, y, z] = 0;
    }

    this.#rotator.rotateXYZ(x, y, z);
  }
}

;// CONCATENATED MODULE: ./src/index.js


const rotationControlManager1 = new RotationControlManager('.cube1');

/******/ })()
;