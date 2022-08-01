import * as THREE from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { Panes, lightFolder, addFolder, addTransformInputs } from './pane'
import { scene } from './scene'

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

export const register = (light: THREE.Light) => {
  lights.add(light)
  
  addGui(light, lightFolder)
}

export const deregister = (light: THREE.Light) => {
  lights.delete(light)

  if (helpersOn && lightHelpers.has(light)) {
    const helper = lightHelpers.get(light)!
    helper.dispose()
    scene.remove(helper)
    lightHelpers.delete(light)

    if (shadowCameraHelpers.has(light)) {
      // const helper = lightHelpers.get(light)!
      // @todo
    }
  }
}

export const addGui = (light: THREE.Light, pane: Panes) => {
  const isDirectional = 'isDirectional' in light
  const isHemi = 'isHemisphereLight' in light
  const isSpot = 'isSpotLight' in light
  const isPoint = 'isPointLight' in light
  const isRectArea = 'isRectAreaLight' in light

  const folder = addFolder(pane, `#${light.id} ${light.name} (${light.type})`)

  const lightColor = {
    color: `#${light.color.getHexString().toUpperCase()}` }

  folder.addInput(lightColor, 'color').on('change', () => light.color.set(lightColor.color))
  folder.addInput(light, 'intensity')

  if (isHemi) {
    folder.addInput(light as THREE.HemisphereLight, 'groundColor')
  }

  if (isDirectional || isSpot || isPoint || isDirectional) {
    folder.addInput(light as THREE.SpotLight | THREE.DirectionalLight | THREE.PointLight | THREE.DirectionalLight, 'castShadow')
    addTransformInputs(folder, light)
    // @TODO camera position
  }

  if (isSpot) {
    folder.addInput(light as THREE.SpotLight, 'angle')
    folder.addInput(light as THREE.SpotLight, 'penumbra')
  }

  if (isSpot || isPoint) {
    folder.addInput(light as THREE.SpotLight | THREE.PointLight, 'decay')
    folder.addInput(light as THREE.SpotLight | THREE.PointLight, 'distance')
  }

  if (isSpot || isPoint || isRectArea) {
    folder.addInput(light as THREE.SpotLight | THREE.PointLight | THREE.RectAreaLight, 'power')
  }

  if (light.castShadow) {
    folder.addInput(light.shadow.mapSize, 'x')
    folder.addInput(light.shadow.mapSize, 'y')
    // light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
		// 		light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
  }

  folder.on('change', () => {
    // @ts-ignore
    lightHelpers.get(light)?.update?.()
    shadowCameraHelpers.get(light)?.update?.()
  })
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
