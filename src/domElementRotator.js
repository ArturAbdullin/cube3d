import { OriginManager } from "./originManager";

export class DOMElementRotator {
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
