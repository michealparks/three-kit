import * as THREE from 'three'
import * as lights from './lights'
import { addFolder, pane } from './pane'
import { save, storage } from './storage'
import { scene } from '../lib'

const sceneFolder = addFolder(pane, 'scene', 0)
const axesHelper = new THREE.AxesHelper(1_000)

const params = {
  axesHelper: storage.axesHelper ?? false,
  fogColor: `#${scene.fog?.color.getHexString().toUpperCase()}`,
  lightHelper: storage.lightHelper ?? false,
}

if (storage.axesHelper) {
  scene.add(axesHelper)
}

if (storage.lightHelper) {
  lights.toggleHelpers(params.lightHelper as boolean)
}

if (scene.fog) {
  const fogFolder = addFolder(sceneFolder, 'fog')
  fogFolder.addInput(params, 'fogColor', {
    label: 'color',
  }).on('change', () => {
    scene.fog?.color.set(params.fogColor!)
  })

  if (scene.fog instanceof THREE.Fog) {
    fogFolder.addInput(scene.fog, 'near')
    fogFolder.addInput(scene.fog, 'far')
  }
}

sceneFolder.addInput(params, 'axesHelper', {
  label: 'axes',
}).on('change', () => {
  scene[params.axesHelper ? 'add' : 'remove'](axesHelper)
  save('axesHelper', params.axesHelper)
})

sceneFolder.addInput(params, 'lightHelper', {
  label: 'light helpers',
}).on('change', () => {
  lights.toggleHelpers(params.lightHelper as boolean)
  save('lightHelper', params.lightHelper)
})
