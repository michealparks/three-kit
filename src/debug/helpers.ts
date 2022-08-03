import * as THREE from 'three'
import { pane, addFolder } from './pane'
import * as lights from './lights'
import { scene } from '../lib'

const helpersFolder = addFolder(pane, 'helpers')
const axesHelper = new THREE.AxesHelper(1_000)

const params = {
  axes: false,
  lights: false,
}

helpersFolder.addInput(params, 'axes').on('change', () => {
  return params.axes ? scene.add(axesHelper) : scene.remove(axesHelper)
})

helpersFolder.addInput(params, 'lights').on('change', () => {
  lights.toggleHelpers(scene, params.lights)
})
