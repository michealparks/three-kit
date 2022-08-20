import * as THREE from 'three'

/**
 * Generates a random float in [-range, range]
 * 
 * @param range The range
 * @returns A random number in the range
 */
export const randomNumber = (range: number): number => {
  return Math.random() * range * 2 - range
}

/**
 * Generates a random float between a min and max
 * 
 * @param min The minimum number
 * @param max The maximum number
 * @returns A random number between two numbers
 */
export const randomNumberBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 * Clamps a number between two values
 * 
 * @param n The number to clamp
 * @param min The min value
 * @param max The max value 
 * @returns 
 */
export const clamp = (n: number, min: number, max: number) => {
  return Math.min(Math.max(n, min), max)
}

/**
 * Generates a random 2d point within a circle
 * 
 * @param R The radius of the circle
 * @returns A random point
 */
export const randomPointInCircle = (R: number): [x: number, y: number] => {
  const r = R * Math.sqrt(Math.random())
  const theta = Math.random() * 2 * Math.PI
  const x = r * Math.cos(theta)
  const y = r * Math.sin(theta)
  return [x, y]
}

/**
 * Generates a random 3d point within a sphere
 * 
 * @param R The radius of the sphere
 * @returns A random point
 */
export const randomPointInSphere = (R: number): [x: number, y: number, z: number] => {
  const u = Math.random()
  const v = Math.random()
  const theta = u * 2 * Math.PI
  const phi = Math.acos(2 * v - 1)
  const r = Math.cbrt(Math.random() * R)
  const sinTheta = Math.sin(theta)
  const cosTheta = Math.cos(theta)
  const sinPhi = Math.sin(phi)
  const cosPhi = Math.cos(phi)
  const x = r * sinPhi * cosTheta
  const y = r * sinPhi * sinTheta
  const z = r * cosPhi
  return [x, y, z]
}

/**
 * Generates a random 3d point on the surface of a sphere
 * 
 * @param R The radius of the sphere
 * @returns A random point
 */
export const randomPointOnSphere = (R: number): [x: number, y: number, z: number] => {
  const u = Math.random()
  const v = Math.random()
  const theta = u * 2 * Math.PI
  const phi = Math.acos(2 * v - 1)
  const r = Math.cbrt(Math.random() + R)
  const sinTheta = Math.sin(theta)
  const cosTheta = Math.cos(theta)
  const sinPhi = Math.sin(phi)
  const cosPhi = Math.cos(phi)
  const x = r * sinPhi * cosTheta
  const y = r * sinPhi * sinTheta
  const z = r * cosPhi
  return [x, y, z]
}

export const getForward = (object: THREE.Object3D) => {
  const forward = new THREE.Vector3(0, 0, -1);
  forward.applyQuaternion(object.quaternion);
  return forward;
}

export const getUp = (object: THREE.Object3D) => {
  const forward = new THREE.Vector3(0, 1, 0);
  forward.applyQuaternion(object.quaternion);
  return forward;
}
