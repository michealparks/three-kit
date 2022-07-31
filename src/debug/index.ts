import * as THREE from 'three'
import type { HTMLMesh } from 'three/examples/jsm/interactive/HTMLMesh'
import { createStats } from './stats'
import { createHTMLMesh } from './html-mesh'
import { createControllerModels } from './xr'
import * as lights from './lights'
import * as meshes from './meshes'
import * as ui from './pane'

export interface Debug {
  ui: ui.Panes
  update(): void
  createControllerModels: typeof createControllerModels
}

const createHelperFolder = (pane: ui.Panes, scene: THREE.Scene) => {
  const axesHelper = new THREE.AxesHelper(1_000)
  const folder = ui.addFolder(pane, 'helpers')

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

export const createDebugTools = (parameters: { xr?: boolean } = {}, renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): Debug => {
  const pane = ui.create()

  let uiMesh: HTMLMesh | undefined

  const lightFolder = ui.addFolder(pane, 'lights')
  const meshFolder = ui.addFolder(pane, 'meshes')
  const add = scene.add.bind(scene)
  const remove = scene.remove.bind(scene)

  scene.add = (...args) => {
    const [object] = args

    if ('isLight' in object) {
      lights.register(scene, object as THREE.Light, lightFolder)
    } else if ('isMesh' in object) {
      meshes.register(meshFolder, object as THREE.Mesh)
    }

    return add(...args)
  }

  scene.remove = (...args) => {
    return remove(...args)
  }

  createHelperFolder(pane, scene)

  const gameFolder = ui.addFolder(pane, 'game')
  const stats = createStats()
  let statsMesh: HTMLMesh | undefined

  if (parameters.xr) {
    uiMesh = createHTMLMesh(pane.element, renderer, scene, camera)
    uiMesh.position.set(-0.75, 1.5, -0.5)
    uiMesh.rotation.set(0, Math.PI / 4, 0)

    statsMesh = createHTMLMesh(stats.dom, renderer, scene, camera)
    statsMesh.position.set(-0.75, 1.8, -0.5)
    statsMesh.rotation.set(0, Math.PI / 4, 0)
  }

  if (parameters.xr) {
    setInterval(() => {
      // Canvas elements doesn't trigger DOM updates, so we have to update the texture
      // @ts-ignore
      statsMesh?.material.map.update()
      // @ts-ignore
      uiMesh?.material.map.update()
    }, 1000)
  }

  const update = () => {
    stats.update()
  }

  return {
    ui: gameFolder,
    update,
    createControllerModels,
  }
}
