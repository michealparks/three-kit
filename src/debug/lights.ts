import * as THREE from 'three'
import { Panes, addFolder, pane } from './pane'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { addTransformInputs } from './inputs/transform'
import { defaultMinMax } from './constants'
import { scene } from '../lib'

type LightHelper =
  | THREE.SpotLightHelper
  | THREE.DirectionalLightHelper
  | THREE.HemisphereLightHelper
  | RectAreaLightHelper
  | THREE.PointLightHelper
  | THREE.CameraHelper

export const lightFolder = addFolder(pane, 'lights', 1)

const lights = new Set<THREE.Light>()
const lightHelpers = new Map<THREE.Light, LightHelper>()
const shadowCameraHelpers = new Map<THREE.Light, THREE.CameraHelper>()

const helpersOn = false

export const addGui = (light: THREE.Light, parent: Panes) => {
  const folder = addFolder(parent, `#${light.id} ${light.name} (${light.type})`)

  const lightColor = {
    color: `#${light.color.getHexString().toUpperCase()}`,
  }

  folder
    .addInput(lightColor, 'color')
    .on('change', () => {
      light.color.set(lightColor.color)
    })
  folder.addInput(light, 'intensity')

  if (light instanceof THREE.HemisphereLight) {
    folder.addInput(light, 'groundColor')
  }

  if (
    light instanceof THREE.DirectionalLight ||
    light instanceof THREE.SpotLight ||
    light instanceof THREE.PointLight
  ) {
    folder.addInput(light, 'castShadow')
    addTransformInputs(folder, light)
    // @TODO camera position
  }

  if (light instanceof THREE.SpotLight) {
    folder.addInput(light, 'angle', {
      max: Math.PI / 2,
      min: 0,
    })
    folder.addInput(light, 'penumbra', defaultMinMax)
  }

  if (
    light instanceof THREE.SpotLight ||
    light instanceof THREE.PointLight
  ) {
    folder.addInput(light, 'decay')
    folder.addInput(light, 'distance')
  }

  if (
    light instanceof THREE.SpotLight ||
    light instanceof THREE.PointLight ||
    light instanceof THREE.RectAreaLight
  ) {
    folder.addInput(light, 'power')
  }

  if (light instanceof THREE.RectAreaLight) {
    folder.addInput(light, 'width')
    folder.addInput(light, 'height')
  }

  if (light.castShadow) {
    const camFolder = addFolder(folder, `#${light.id} shadow`)

    const shadowMapParams = {
      mapSize: light.shadow.mapSize.x,
    }

    camFolder.addInput(shadowMapParams, 'mapSize', {
      options: {
        1024: 1024,
        2048: 2048,
        256: 256,
        512: 512,
      },
    }).on('change', () => {
      light.shadow.mapSize.width = shadowMapParams.mapSize
      light.shadow.mapSize.height = shadowMapParams.mapSize
      light.shadow.dispose()
      light.shadow.map = null
    })

    camFolder.addInput(light.shadow, 'bias', {
      max: 0.09,
      min: 0,
      step: 0.001,
    })

    if (
      light instanceof THREE.SpotLight ||
      light instanceof THREE.DirectionalLight
    ) {
      const camera = light.shadow.camera
      camFolder.addInput(camera, 'near')
      camFolder.addInput(camera, 'far')
    }

    if (light instanceof THREE.SpotLight) {
      const camera = light.shadow.camera
      camFolder.addInput(camera, 'focus', defaultMinMax)
    }
  }

  folder.on('change', () => {
    // @ts-expect-error update() is not correctly typed
    lightHelpers.get(light)?.update?.()
    shadowCameraHelpers.get(light)?.update()
  })
}

export const register = (light: THREE.Light) => {
  lights.add(light)

  addGui(light, lightFolder)
}

export const deregister = (light: THREE.Light) => {
  lights.delete(light)

  const helper = lightHelpers.get(light)

  if (helpersOn && helper !== undefined) {
    helper.dispose()
    scene.remove(helper)
    lightHelpers.delete(light)

    if (shadowCameraHelpers.has(light)) {
      // @Todo
    }
  }
}

const addHelpers = (light: THREE.Light) => {
  let helper: LightHelper
  let shadowCameraHelper: THREE.CameraHelper | undefined

  if (light instanceof THREE.AmbientLight) {
    return
  } else if (light instanceof THREE.SpotLight) {
    helper = new THREE.SpotLightHelper(light)
    if (light.castShadow) {
      shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera)
    }
  } else if (light instanceof THREE.DirectionalLight) {
    helper = new THREE.DirectionalLightHelper(light)
    if (light.castShadow) {
      shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera)
    }
  } else if (light instanceof THREE.HemisphereLight) {
    helper = new THREE.HemisphereLightHelper(light, 10)
  } else if (light instanceof THREE.RectAreaLight) {
    helper = new RectAreaLightHelper(light)
    if (light.castShadow) {
      shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera)
    }
  } else if (light instanceof THREE.PointLight) {
    helper = new THREE.PointLightHelper(light, 10)
  }

  if (shadowCameraHelper) {
    scene.add(shadowCameraHelper)
    shadowCameraHelpers.set(light, shadowCameraHelper)
  }

  scene.add(helper)
  lightHelpers.set(light, helper)
}

const removeHelpers = () => {
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

export const toggleHelpers = (on: boolean) => {
  if (on) {
    for (const light of lights) {
      addHelpers(light)
    }
  } else {
    removeHelpers()
  }
}
