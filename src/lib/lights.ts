import * as THREE from 'three'
import { RectAreaLightUniformsLib } from  'three/examples/jsm/lights/RectAreaLightUniformsLib'

export const createSpot = (
  color = 0xEFC070,
  intensity = 20,
  penumbra = 1,
  decay = 2,
  castShadow = false,
  shadowNear = 2,
  shadowFar = 50,
  shadowMapSize = 128
) => {
  const light = new THREE.SpotLight(color, intensity)
  light.penumbra = penumbra
  light.decay = decay
  light.castShadow = castShadow
  light.shadow.camera.near = shadowNear
  light.shadow.camera.far = shadowFar
  light.shadow.mapSize.width = shadowMapSize
  light.shadow.mapSize.height = shadowMapSize
  return light
}

export const createDirectional = (
  color = 0xEFC070,
  intensity = 3,
  castShadow = false,
  shadowNear = 2,
  shadowFar = 50,
  shadowMapSize = 128
) => {
  const light = new THREE.DirectionalLight(color, intensity)
  light.castShadow = castShadow
  light.shadow.camera.near = shadowNear
  light.shadow.camera.far = shadowFar
  light.shadow.mapSize.width = shadowMapSize
  light.shadow.mapSize.height = shadowMapSize
  return light
}

export const createAmbient = (color = 0xFFF5B6, intensity = 0.5) => {
  const light = new THREE.AmbientLight(color, intensity)
  return light
}

let didInit = false

export const createRectArea = (color = 0xFFF5B6, intensity = 1, width = 1, height = 1) => {
  if (didInit === false) {
    RectAreaLightUniformsLib.init()
    didInit = true
  }

  const rectLight = new THREE.RectAreaLight(color, intensity, width, height)
  return rectLight
}
