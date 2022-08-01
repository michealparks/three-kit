import * as THREE from 'three'
import { addFolder, Panes } from './pane'
import * as lights from './lights'
import { scene } from '../lib'

export const addHelpersFolder = (pane: Panes) => {
  const axesHelper = new THREE.AxesHelper(1_000)
  const folder = addFolder(pane, 'helpers')

  const params = {
    axes: false,
    lights: false,
  }

  folder.addInput(params, 'axes').on('change', () => {
    return params.axes ? scene.add(axesHelper) : scene.remove(axesHelper)
  })

  folder.addInput(params, 'lights').on('change', () => {
    lights.toggleHelpers(scene, params.lights)
  })
}
