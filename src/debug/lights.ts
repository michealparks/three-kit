import * as THREE from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

type LightHelper = 
  | THREE.SpotLightHelper
  | THREE.DirectionalLightHelper
  | THREE.HemisphereLightHelper
  | RectAreaLightHelper
  | THREE.PointLightHelper
  | THREE.CameraHelper

const lights = new Set<THREE.Light>()
const lightHelpers = new Set<LightHelper>()

export const register = (light: THREE.Light) => {
  lights.add(light)
}

export const deregister = (light: THREE.Light) => {
  lights.delete(light)
}

export const toggleHelpers = (scene: THREE.Scene, on: boolean) => {
  for (const light of lights) {
    if (on) {
      let helper: LightHelper
      let shadowCameraHelper: THREE.CameraHelper | undefined

      if ((light as THREE.SpotLight).isSpotLight) {

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
        lightHelpers.add(shadowCameraHelper)
      }

      scene.add(helper)
      lightHelpers.add(helper)
    } else {

      for (const helper of lightHelpers) {
        scene.remove(helper)
        helper.dispose()
      }

      lightHelpers.clear()

    }
  }
}