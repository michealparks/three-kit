import { camera, renderer, update } from '../lib'
import { erase, save, storage } from './storage'
import { addFolder, pane } from './pane'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { addTransformInputs } from './pane/inputs'

const constants = {
  CONTROLS_MAP: 2,
  CONTROLS_NONE: 0,
  CONTROLS_ORBIT: 1,
}

const params = {
  controls: storage.controls ?? constants.CONTROLS_NONE,
}

const cps = camera.position.set.bind(camera.position)

camera.position.set = (...args) => {
  if (params.controls !== constants.CONTROLS_NONE) {
    return camera.position
  }
  return cps(...args)
}

export const orbitControls = new OrbitControls(camera, renderer.domElement)

if (storage.debugCamera && params.controls !== constants.CONTROLS_NONE) {
  const cam = storage.debugCamera as {
    target: number[]
    quaternion: number[]
    position: number[]
  }
  orbitControls.target.fromArray(cam.target)
  camera.quaternion.fromArray(cam.quaternion)
  camera.position.fromArray(cam.position)
  orbitControls.update()
}

const controls = [
  constants.CONTROLS_NONE,
  constants.CONTROLS_ORBIT,
  constants.CONTROLS_MAP,
]

const savePosition = () => {
  save('debugCamera', {
    position: camera.position.toArray(),
    quaternion: camera.quaternion.toArray(),
    target: orbitControls.target.toArray(),
  })
}

const setEnabledControls = () => {
  save('controls', params.controls)

  if (params.controls === constants.CONTROLS_NONE) {
    erase('debugCamera')
    camera.name = 'defaultCamera'
    orbitControls.enabled = false
    window.removeEventListener('pointerup', savePosition)
    window.removeEventListener('wheel', savePosition)
  } else {
    camera.name = 'debugCamera'
    orbitControls.enabled = true
    window.addEventListener('pointerup', savePosition, { passive: true })
    window.addEventListener('wheel', savePosition, { passive: true })
  }
}

const handleCameraChange = () => {
  camera.updateProjectionMatrix()
}

const cameraFolder = addFolder(pane, 'camera', 1)

const titles = ['none', 'orbit', 'map']

cameraFolder.addInput(params, 'controls', {
  cells: (x: number, y: number) => {
    return {
      title: titles[controls[(y * 3) + x]],
      value: controls[(y * 3) + x],
    }
  },
  groupName: 'controls',
  label: 'controls',
  size: [3, 1],
  view: 'radiogrid',
}).on('change', setEnabledControls)

cameraFolder.addInput(camera, 'near').on('change', handleCameraChange)
cameraFolder.addInput(camera, 'far').on('change', handleCameraChange)

if (import.meta.env.THREE_CAMERA === 'perspective') {
  const cam = camera as THREE.PerspectiveCamera
  cameraFolder.addInput(cam, 'fov').on('change', handleCameraChange)
  cameraFolder.addInput(cam, 'filmOffset').on('change', handleCameraChange)
  cameraFolder.addInput(cam, 'filmGauge').on('change', handleCameraChange)
  cameraFolder.addInput(cam, 'zoom').on('change', handleCameraChange)
}

setEnabledControls()

addTransformInputs(cameraFolder, camera)

update(() => {
  if (params.controls === constants.CONTROLS_NONE) {
    return
  }

  orbitControls.update()
})
