import * as THREE from 'three'
import type { HTMLMesh } from 'three/examples/jsm/interactive/HTMLMesh'
import { createStats } from './stats'
import { createUI } from './ui'
import { createHTMLMesh } from './html-mesh'
import { createControllerModels } from './xr'
import * as lights from './lights'

type GUI = ReturnType<typeof createUI>

export interface Debug {
  ui: GUI
  update(): void
  createControllerModels: typeof createControllerModels
}

const createHelperFolder = (ui: GUI, scene: THREE.Scene) => {
  const axesHelper = new THREE.AxesHelper(1_000)
  const helperFolder = ui.addFolder('helpers')

  const helperFolderParams = {
    axes: false,
    lights: false,
  }

  helperFolder.add(helperFolderParams, 'axes').onChange(() => {
    return helperFolderParams.axes ? scene.add(axesHelper) : scene.remove(axesHelper)
  })

  helperFolder.add(helperFolderParams, 'lights').onChange(() => {
    lights.toggleHelpers(scene, helperFolderParams.lights)
  })
}

export const createDebugTools = (parameters: { xr?: boolean } = {}, renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): Debug => {
  const add = scene.add.bind(scene)
  scene.add = (...args) => {
    const [object] = args

    if ((object as THREE.Light).isLight && ('isAmbientLight' in object) === false) {
      lights.register(object as THREE.Light)
    }

    add(...args)

    return scene
  }

  
  const stats = createStats()
  const ui = createUI()
  let htmlMesh: HTMLMesh | undefined
  let statsMesh: HTMLMesh | undefined

  createHelperFolder(ui, scene)

  const gameFolder = ui.addFolder('game')

  if (parameters.xr) {
    htmlMesh = createHTMLMesh(ui.domElement, renderer, scene, camera)
    htmlMesh.position.set(-0.75, 1.5, -0.5)
    htmlMesh.rotation.set(0, Math.PI / 4, 0)

    statsMesh = createHTMLMesh(stats.dom, renderer, scene, camera)
    statsMesh.position.set(-0.75, 1.8, -0.5)
    statsMesh.rotation.set(0, Math.PI / 4, 0)
  }

  console.log(statsMesh?.material)

  const update = () => {
    stats.update()
  
    // Canvas elements doesn't trigger DOM updates, so we have to update the texture
    // @ts-ignore
    statsMesh?.material.map.update()
    // @ts-ignore
    htmlMesh?.material.map.update()
  }

  return {
    ui: gameFolder,
    update,
    createControllerModels,
  }
}
