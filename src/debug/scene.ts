import * as THREE from 'three'
import { pane, addFolder } from './pane'
import * as lights from './lights'
import { scene, camera } from '../lib'

const sceneFolder = addFolder(pane, 'scene', 0)
const axesHelper = new THREE.AxesHelper(1_000)

const params = {
  axesHelper: false,
  lightHelper: false,
}

sceneFolder.addInput(params, 'axesHelper', {
  label: 'axes',
}).on('change', () => {
  return params.axesHelper ? scene.add(axesHelper) : scene.remove(axesHelper)
})

sceneFolder.addInput(params, 'lightHelper', {
  label: 'light helpers'
}).on('change', () => {
  lights.toggleHelpers(scene, params.lightHelper)
})

const handleCameraChange = () => {
  camera.updateProjectionMatrix()
}

const cameraFolder = addFolder(sceneFolder, 'camera')
cameraFolder.addInput(camera, 'near').on('change', handleCameraChange)
cameraFolder.addInput(camera, 'far').on('change', handleCameraChange)

if (import.meta.env.THREE_CAMERA === 'perspective') {
  const cam = camera as THREE.PerspectiveCamera
  cameraFolder.addInput(cam, 'fov').on('change', handleCameraChange)
  cameraFolder.addInput(cam, 'filmOffset').on('change', handleCameraChange)
  cameraFolder.addInput(cam, 'filmGauge').on('change', handleCameraChange)
  cameraFolder.addInput(cam, 'zoom').on('change', handleCameraChange)
}
