import * as THREE from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import type GUI from 'lil-gui'
import * as folders from './folders'

type LightHelper = 
  | THREE.SpotLightHelper
  | THREE.DirectionalLightHelper
  | THREE.HemisphereLightHelper
  | RectAreaLightHelper
  | THREE.PointLightHelper
  | THREE.CameraHelper

const lights = new Set<THREE.Light>()
const lightHelpers = new Map<THREE.Light, LightHelper>()
const shadowCameraHelpers = new Map<THREE.Light, THREE.CameraHelper>()

let helpersOn = false

export const register = (scene: THREE.Scene, light: THREE.Light, ui: GUI) => {
  lights.add(light)
  
  addGui(light, ui)

  if ('isAmbientLight' in light) return
}

export const deregister = (scene: THREE.Scene, light: THREE.Light) => {
  lights.delete(light)

  if (helpersOn && lightHelpers.has(light)) {
    const helper = lightHelpers.get(light)!
    helper.dispose()
    scene.remove(helper)
    lightHelpers.delete(light)

    if (shadowCameraHelpers.has(light)) {
      const helper = lightHelpers.get(light)!
      // @todo
    }
  }
}

export const addGui = (light: THREE.Light, ui: GUI) => {
  const folder = folders.addFolder(ui, `#${light.id} ${light.name} (${light.type})`)
  const parameters: any = {
    color: `#${light.color.getHexString().toUpperCase()}`,
    intensity: light.intensity,
    distance: light.distance,
    angle: light.angle,
    penumbra: light.penumbra,
    decay: light.decay,
    focus: light.shadow?.focus,
    castShadow: light.castShadow,
  }

  if ('isAmbientLight' in light) {
    delete parameters.castShadow
  }

  for (const key of Object.keys(parameters)) {
    if (key in light) {
      const method = key === 'color' ? 'addColor' : 'add'
      folder[method](parameters, key).onChange(() => {
        if (key === 'color') {
          light.color.set(parameters.color)
        } else {
          light[key] = parameters[key]
        }

        lightHelpers.get(light)?.update?.()
        shadowCameraHelpers.get(light)?.update?.()
      })
    }
  }

  folders.addTransformFolder(folder, light)
}

const addHelpers = (scene: THREE.Scene, light: THREE.Light) => {
  let helper: LightHelper
  let shadowCameraHelper: THREE.CameraHelper | undefined

  if ('isAmbientLight' in light) {

    return

  } else if ('isSpotLight' in light) {

    helper = new THREE.SpotLightHelper(light)
    if (light.castShadow) shadowCameraHelper = new THREE.CameraHelper( light.shadow.camera )
    
  } else if ((light as THREE.DirectionalLight).isDirectionalLight) {

    helper = new THREE.DirectionalLightHelper(light as THREE.DirectionalLight)
    if (light.castShadow) shadowCameraHelper = new THREE.CameraHelper( light.shadow.camera )

  } else if ((light as THREE.HemisphereLight).isHemisphereLight) {

    helper = new THREE.HemisphereLightHelper(light as THREE.HemisphereLight, 10)

  } else if ((light as THREE.RectAreaLight).isRectAreaLight) {

    helper = new RectAreaLightHelper(light as THREE.RectAreaLight)
    if (light.castShadow) shadowCameraHelper = new THREE.CameraHelper( light.shadow.camera )

  } else {

    helper = new THREE.PointLightHelper(light as THREE.PointLight, 10)

  }

  if (shadowCameraHelper) {
    scene.add(shadowCameraHelper)
    shadowCameraHelpers.set(light, shadowCameraHelper)
  }

  scene.add(helper)
  lightHelpers.set(light, helper)
}

const removeHelpers = (scene: THREE.Scene) => {
  for (const [, helper] of lightHelpers) {
    scene.remove(helper)
    helper.dispose()
  }

  for (const [, helper] of shadowCameraHelpers) {
    scene.remove(helper)
    helper.dispose()
  }

  lightHelpers.clear()
  shadowCameraHelpers.clear()
}

export const toggleHelpers = (scene: THREE.Scene, on: boolean) => {
  if (on) {
    for (const light of lights) {
      addHelpers(scene, light)
    }
  } else {
    removeHelpers(scene)
  }
}