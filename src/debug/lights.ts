import * as THREE from 'three'
import { Panes, addFolder, pane } from './pane'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { addTransformInputs } from './pane/inputs'
import { scene } from '../lib'

type LightHelper =
  | THREE.SpotLightHelper
  | THREE.DirectionalLightHelper
  | THREE.HemisphereLightHelper
  | RectAreaLightHelper
  | THREE.PointLightHelper
  | THREE.CameraHelper

type LightWithShadow =
  | THREE.SpotLight
  | THREE.DirectionalLight
  | THREE.PointLight
  | THREE.DirectionalLight

export const lightFolder = addFolder(pane, 'lights', 1)

const lights = new Set<THREE.Light>()
const lightHelpers = new Map<THREE.Light, LightHelper>()
const shadowCameraHelpers = new Map<THREE.Light, THREE.CameraHelper>()

const helpersOn = false

export const addGui = (light: THREE.Light, parent: Panes) => {
  const isDirectional = 'isDirectionalLight' in light
  const isHemi = 'isHemisphereLight' in light
  const isSpot = 'isSpotLight' in light
  const isPoint = 'isPointLight' in light
  const isRectArea = 'isRectAreaLight' in light

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

  if (isHemi) {
    folder.addInput(light as THREE.HemisphereLight, 'groundColor')
  }

  if (isDirectional || isSpot || isPoint) {
    folder.addInput(light as LightWithShadow, 'castShadow')
    addTransformInputs(folder, light)
    // @TODO camera position
  }

  if (isSpot) {
    folder.addInput(light as THREE.SpotLight, 'angle', {
      max: Math.PI / 2,
      min: 0,
    })
    folder.addInput(light as THREE.SpotLight, 'penumbra', {
      max: 1,
      min: 0,
    })
  }

  if (isSpot || isPoint) {
    folder.addInput(light as THREE.SpotLight | THREE.PointLight, 'decay')
    folder.addInput(light as THREE.SpotLight | THREE.PointLight, 'distance')
  }

  if (isSpot || isPoint || isRectArea) {
    const spotlight = light as THREE.SpotLight | THREE.PointLight | THREE.RectAreaLight
    folder.addInput(spotlight, 'power')
  }

  if (isRectArea) {
    folder.addInput(light as THREE.RectAreaLight, 'width')
    folder.addInput(light as THREE.RectAreaLight, 'height')
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

    if (isSpot || isDirectional) {
      const camera = light.shadow.camera as THREE.OrthographicCamera
      camFolder.addInput(camera, 'near')
      camFolder.addInput(camera, 'far')
    }

    if (isSpot) {
      const camera = light.shadow.camera as THREE.PerspectiveCamera
      camFolder.addInput(camera, 'focus', {
        max: 1,
        min: 0,
      })
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

  if ('isAmbientLight' in light) {
    return
  } else if ('isSpotLight' in light) {
    helper = new THREE.SpotLightHelper(light)
    if (light.castShadow) {
      shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera)
    }
  } else if ('isDirectionalLight' in light) {
    helper = new THREE.DirectionalLightHelper(light as THREE.DirectionalLight)
    if (light.castShadow) {
      shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera)
    }
  } else if ('isHemisphereLight' in light) {
    helper = new THREE.HemisphereLightHelper(light as THREE.HemisphereLight, 10)
  } else if ('isRectAreaLight' in light) {
    helper = new RectAreaLightHelper(light as THREE.RectAreaLight)
    if (light.castShadow) {
      shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera)
    }
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
