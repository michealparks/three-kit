import * as THREE from 'three'

import { pane, addFolder } from './pane'
import * as lights from './lights'
import { scene } from '../lib'
import { storage, save } from './storage'

const sceneFolder = addFolder(pane, 'scene', 0)
const axesHelper = new THREE.AxesHelper(1_000)

{
  const params = {
    axesHelper: storage.axesHelper ?? false,
    lightHelper: storage.lightHelper ?? false,
  }

  if (storage.axesHelper) {
    scene.add(axesHelper)
  }

  if (storage.lightHelper) {
    lights.toggleHelpers(params.lightHelper)
  }

  sceneFolder.addInput(params, 'axesHelper', {
    label: 'axes',
  }).on('change', () => {
    scene[params.axesHelper ? 'add' : 'remove'](axesHelper)
    save('axesHelper', params.axesHelper)
  })

  sceneFolder.addInput(params, 'lightHelper', {
    label: 'light helpers'
  }).on('change', () => {
    lights.toggleHelpers(params.lightHelper)
    save('lightHelper', params.lightHelper)
  })  
}
