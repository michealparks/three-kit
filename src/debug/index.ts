import * as THREE from 'three'
import type { HTMLMesh } from 'three/examples/jsm/interactive/HTMLMesh'
import GUI from 'lil-gui'
import { createStats } from './stats'
import { createHTMLMesh } from './html-mesh'
import { createControllerModels } from './xr'
import * as lights from './lights'
import * as meshes from './meshes'
import * as folders from './folders'

export interface Debug {
  ui: GUI
  update(): void
  createControllerModels: typeof createControllerModels
}

const createHelperFolder = (ui: GUI, scene: THREE.Scene) => {
  const axesHelper = new THREE.AxesHelper(1_000)
  const folder = folders.addFolder(ui, 'helpers')

  const params = {
    axes: false,
    lights: false,
  }

  folder.add(params, 'axes').onChange(() => {
    return params.axes ? scene.add(axesHelper) : scene.remove(axesHelper)
  })

  folder.add(params, 'lights').onChange(() => {
    lights.toggleHelpers(scene, params.lights)
  })
}

const createUI = () => {
  const ui = new GUI({ width: 300 })

  window.onbeforeunload = () => {
    const closed: Record<string, boolean> = {}
    for (const folder of ui.foldersRecursive()) {
      closed[folder._title] = folder._closed
    }
    localStorage.setItem('gui.folders', JSON.stringify(closed))
  }

  return ui
}

export const createDebugTools = (parameters: { xr?: boolean } = {}, renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): Debug => {
  const ui = createUI()

  let uiMesh: HTMLMesh | undefined

  const lightFolder = folders.addFolder(ui, 'lights')
  const meshFolder = folders.addFolder(ui, 'meshes')
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

  createHelperFolder(ui, scene)

  const gameFolder = folders.addFolder(ui, 'game')
  const stats = createStats()
  let statsMesh: HTMLMesh | undefined

  if (parameters.xr) {
    uiMesh = createHTMLMesh(ui.domElement, renderer, scene, camera)
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
