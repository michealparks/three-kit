import * as THREE from 'three'
import { OrbitControls, MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { pane, addFolder } from './pane'
import * as lights from './lights'
import { renderer, scene, camera, update } from '../lib'
import { addTransformInputs } from './pane/inputs'

const sceneFolder = addFolder(pane, 'scene', 0)
const axesHelper = new THREE.AxesHelper(1_000)

{
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
}

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

const camControlsFolder = addFolder(cameraFolder, 'controls')

{
  const params = {
    controls: 0,
  }

  const orbitControls = new OrbitControls(camera, renderer.domElement)
  orbitControls.enableDamping = true
  

  const mapControls = new MapControls(camera, renderer.domElement)
  mapControls.enableDamping = true
  

  const setEnabledControls = () => {
    orbitControls.enabled = params.controls === 1
    mapControls.enabled = params.controls === 2
  }

  const controls = [0, 1, 2]
  const titles = ['none', 'orbit', 'map']
  camControlsFolder.addInput(params, 'controls', {
    view: 'radiogrid',
    groupName: 'controls',
    size: [3, 1],
    cells: (x: number, y: number) => ({
      title: titles[controls[y * 3 + x]],
      value: controls[y * 3 + x],
    }),
    label: 'type',
  }).on('change', () => setEnabledControls())

  setEnabledControls()

  addTransformInputs(camControlsFolder, camera)

  update(() => {
    if (params.controls === 1) {
      orbitControls.update()
    } else if (params.controls === 2) {
      mapControls.update()
    }
  })
}
