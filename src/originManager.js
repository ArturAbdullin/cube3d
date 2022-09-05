export class OriginManager {
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
      rotMatrix[0] * this.origin[0] +
      rotMatrix[1] * this.origin[3] +
      rotMatrix[2] * this.origin[6];
    const m12 =
      rotMatrix[0] * this.origin[1] +
      rotMatrix[1] * this.origin[4] +
      rotMatrix[2] * this.origin[7];
    const m13 =
      rotMatrix[0] * this.origin[2] +
      rotMatrix[1] * this.origin[5] +
      rotMatrix[2] * this.origin[8];
    const m21 =
      rotMatrix[3] * this.origin[0] +
      rotMatrix[4] * this.origin[3] +
      rotMatrix[5] * this.origin[6];
    const m22 =
      rotMatrix[3] * this.origin[1] +
      rotMatrix[4] * this.origin[4] +
      rotMatrix[5] * this.origin[7];
    const m23 =
      rotMatrix[3] * this.origin[2] +
      rotMatrix[4] * this.origin[5] +
      rotMatrix[5] * this.origin[8];
    const m31 =
      rotMatrix[6] * this.origin[0] +
      rotMatrix[7] * this.origin[3] +
      rotMatrix[8] * this.origin[6];
    const m32 =
      rotMatrix[6] * this.origin[1] +
      rotMatrix[7] * this.origin[4] +
      rotMatrix[8] * this.origin[7];
    const m33 =
      rotMatrix[6] * this.origin[2] +
      rotMatrix[7] * this.origin[5] +
      rotMatrix[8] * this.origin[8];

    this.origin = [m11, m12, m13, m21, m22, m23, m31, m32, m33];
  }
}
