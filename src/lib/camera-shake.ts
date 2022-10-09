
import * as THREE from 'three'
import type {
  MapControls,
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import { removeUpdate, update } from './update'
import type { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { camera } from './camera'
import { createNoise2D } from 'simplex-noise'

export type Controls =
  | PointerLockControls
  | OrbitControls
  | MapControls

const yawNoise = createNoise2D()
const pitchNoise = createNoise2D()
const rollNoise = createNoise2D()

let then = 0
let activeControls: Controls | null = null
let initialRotation = new THREE.Euler()

const updateRotation = () => {
  initialRotation = camera.rotation.clone()
}

const enable = (controls?: OrbitControls) => {
  then = performance.now()
  initialRotation.copy(camera.rotation)
  // eslint-disable-next-line no-use-before-define
  update(tick)

  if (controls) {
    activeControls = controls
    activeControls.addEventListener('change', updateRotation)
  }
}

const disable = () => {
  // eslint-disable-next-line no-use-before-define
  removeUpdate(tick)

  if (activeControls) {
    activeControls.removeEventListener('change', updateRotation)
    activeControls = null
  }
}

export const cameraShake = {
  decay: false,
  decayRate: 0.65,
  disable,
  enable,
  intensity: 0.5,
  maxPitch: 0.05,
  maxRoll: 0.05,
  maxYaw: 0.05,
  pitchFrequency: 0.0005,
  rollFrequency: 0.0005,
  yawFrequency: 0.0005,
}

const constrainIntensity = () => {
  if (cameraShake.intensity < 0) {
    cameraShake.intensity = 0
  } else if (cameraShake.intensity > 1) {
    cameraShake.intensity = 1
  }
}

const tick = (time: number) => {
  const now = performance.now()
  const delta = now - then
  const shake = cameraShake.intensity ** 2
  const yaw = cameraShake.maxYaw * shake * yawNoise(time * cameraShake.yawFrequency, 1)
  const pitch = cameraShake.maxPitch * shake * pitchNoise(time * cameraShake.pitchFrequency, 1)
  const roll = cameraShake.maxRoll * shake * rollNoise(time * cameraShake.rollFrequency, 1)

  camera.rotation.set(
    initialRotation.x + pitch,
    initialRotation.y + yaw,
    initialRotation.z + roll
  )

  if (cameraShake.decay && cameraShake.intensity > 0) {
    cameraShake.intensity -= cameraShake.decayRate * delta
    constrainIntensity()
  }
}
