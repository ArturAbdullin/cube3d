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
  rorateX(angle) {
    this.rotate([-1, 0, 0], angle);
  }

  /**
   *
   * @param {number} angle [rad]
   */
  rorateY(angle) {
    this.rotate([0, 1, 0], angle);
  }

  /**
   *
   * @param {number} angle [rad]
   */
  rorateZ(angle) {
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

;// CONCATENATED MODULE: ./src/index.js


const domElementRotator = new DOMElementRotator(
  document.querySelector(".cube")
);

const turnHandler = (event) => {
  const classList = event.target.classList;
  if (classList.contains('up')) {
    domElementRotator.rotateAngle([1, 0, 0], Math.PI / 2);
  }
  if (classList.contains('down')) {
    domElementRotator.rotateAngle([1, 0, 0], -Math.PI / 2);
  }
  if (classList.contains('left')) {
    domElementRotator.rotateAngle([0, 1, 0], -Math.PI / 2);
  }
  if (classList.contains('right')) {
    domElementRotator.rotateAngle([0, 1, 0], Math.PI / 2);
  }
};

const upButton = document.querySelector(".turn .up");
const downButton = document.querySelector(".turn .down");
const leftButton = document.querySelector(".turn .left");
const rightButton = document.querySelector(".turn .right");

upButton.onclick = turnHandler;
downButton.onclick = turnHandler;
leftButton.onclick = turnHandler;
rightButton.onclick = turnHandler;

/******/ })()
;