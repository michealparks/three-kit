import * as THREE from 'three'
import {
  RectAreaLightUniformsLib
} from 'three/examples/jsm/lights/RectAreaLightUniformsLib'
import { scene } from './scene'

let rectAreaUniformsAdded = false

export const createAmbient = (
  color = 0xFFF5B6,
  intensity = 0.5
) => {
  const light = new THREE.AmbientLight(color, intensity)
  scene.add(light)
  return light
}

export const createDirectional = (
  color = 0xEFC070,
  intensity = 2.5,
  shadowNear = 2,
  shadowFar = 50
) => {
  const light = new THREE.DirectionalLight(color, intensity)

  if (kit__RENDERER_SHADOWMAP) {
    light.castShadow = true
    light.shadow.camera.near = shadowNear
    light.shadow.camera.far = shadowFar
    light.shadow.mapSize.width = kit__RENDERER_SHADOWMAP_SIZE
    light.shadow.mapSize.height = kit__RENDERER_SHADOWMAP_SIZE
  }

  scene.add(light)
  return light
}

export const createHemisphere = (
  skyColor = 0xFFFFBB,
  groundColor = 0x080820,
  intensity = 1
) => {
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)

  scene.add(light)
  return light
}

export const createPoint = (
  color = 0xEFC070,
  intensity = 2,
  shadowNear = 2,
  shadowFar = 50
) => {
  const light = new THREE.PointLight(color, intensity)

  if (kit__RENDERER_SHADOWMAP) {
    light.castShadow = true
    light.shadow.camera.near = shadowNear
    light.shadow.camera.far = shadowFar
    light.shadow.mapSize.width = kit__RENDERER_SHADOWMAP_SIZE
    light.shadow.mapSize.height = kit__RENDERER_SHADOWMAP_SIZE
    light.shadow.radius = 8
    light.shadow.bias = -0.0001
  }

  scene.add(light)
  return light
}

export const createRectArea = (
  color = 0xFFF5B6,
  intensity = 1,
  width = 1,
  height = 1
) => {
  if (!rectAreaUniformsAdded) {
    RectAreaLightUniformsLib.init()
    rectAreaUniformsAdded = true
  }

  const light = new THREE.RectAreaLight(color, intensity, width, height)

  scene.add(light)
  return light
}

export const createSpot = (
  color = 0xEFC070,
  intensity = 5,
  penumbra = 1,
  decay = 2,
  distance = 0,
  shadowNear = 2,
  shadowFar = 50
) => {
  const light = new THREE.SpotLight(color, intensity)
  light.penumbra = penumbra
  light.decay = decay
  light.distance = distance

  if (kit__RENDERER_SHADOWMAP) {
    light.castShadow = true
    light.shadow.camera.near = shadowNear
    light.shadow.camera.far = shadowFar
    light.shadow.mapSize.width = kit__RENDERER_SHADOWMAP_SIZE
    light.shadow.mapSize.height = kit__RENDERER_SHADOWMAP_SIZE
  }

  scene.add(light)
  return light
}

export { createVolumetricSpot } from './spotlight'

export const godraySpot = createPoint()
godraySpot.castShadow = kit__RENDERER_SHADOWMAP

export const godrayDir = createDirectional()
godrayDir.castShadow = kit__RENDERER_SHADOWMAP
