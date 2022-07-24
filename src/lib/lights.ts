import * as THREE from 'three'

export const createSpot = (color = 0xEFC070, intensity = 1.5, castShadow = false) => {
  const light = new THREE.SpotLight(color, intensity)
  light.castShadow = castShadow
  return light
}

export const createDirectional = (color = 0xEFC070, intensity = 3, castShadow = false) => {
  const light = new THREE.DirectionalLight(color, intensity)
  light.castShadow = castShadow
  return light
}

export const createAmbient = (color = 0xFFF5B6, intensity = 0.5) => {
  const light = new THREE.AmbientLight(color, intensity)
  return light
}
