import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'

const AMBIENT_INTENSITY = Number.parseFloat(import.meta.env.THREE_AMBIENT_INTENSITY)
const DIRECTIONAL_INTENSITY = Number.parseFloat(import.meta.env.THREE_DIRECTIONAL_INTENSITY)
const HEMI_INTENSITY = Number.parseFloat(import.meta.env.THREE_HEMI_INTENSITY)
const SPOT_INTENSITY = Number.parseFloat(import.meta.env.THREE_SPOT_INTENSITY)

const SHADOW_MAP = import.meta.env.THREE_SHADOW_MAP === 'true'
const SHADOW_MAP_SIZE = Number.parseInt(import.meta.env.THREE_SHADOW_MAP_SIZE, 10)

let rectAreaUniformsAdded = false

export const createAmbient = (
  color = import.meta.env.THREE_AMBIENT_COLOR,
  intensity = AMBIENT_INTENSITY
) => {
  const light = new THREE.AmbientLight(color, intensity)
  return light
}

export const createDirectional = (
  color = import.meta.env.THREE_DIRECTIONAL_COLOR,
  intensity = DIRECTIONAL_INTENSITY,
  shadowNear = 2,
  shadowFar = 50,
) => {
  const light = new THREE.DirectionalLight(color, intensity)
  
  if (SHADOW_MAP) {
    light.castShadow = true
    light.shadow.camera.near = shadowNear
    light.shadow.camera.far = shadowFar
    light.shadow.mapSize.width = SHADOW_MAP_SIZE
    light.shadow.mapSize.height = SHADOW_MAP_SIZE
  }

  return light
}

export const createHemisphere = (
  skyColor = 0xffffbb,
  groundColor = 0x080820,
  intensity = HEMI_INTENSITY
) => {
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
  return light
}

export const createRectArea = (
  color = 0xFFF5B6,
  intensity = 1,
  width = 1,
  height = 1
) => {
  if (rectAreaUniformsAdded === false) {
    RectAreaLightUniformsLib.init()
    rectAreaUniformsAdded = true
  }

  const rectLight = new THREE.RectAreaLight(color, intensity, width, height)
  return rectLight
}

export const createSpot = (
  color = import.meta.env.THREE_SPOT_COLOR,
  intensity = SPOT_INTENSITY,
  penumbra = 1,
  decay = 2,
  shadowNear = 2,
  shadowFar = 50,
) => {
  const light = new THREE.SpotLight(color, intensity)
  light.penumbra = penumbra
  light.decay = decay

  if (SHADOW_MAP) {
    light.castShadow = true
    light.shadow.camera.near = shadowNear
    light.shadow.camera.far = shadowFar
    light.shadow.mapSize.width = SHADOW_MAP_SIZE
    light.shadow.mapSize.height = SHADOW_MAP_SIZE
  }

  return light
}
