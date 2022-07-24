import type { HTMLMesh } from 'three/examples/jsm/interactive/HTMLMesh'
import { createStats } from './stats'
import { createUI } from './ui'
import { createHTMLMesh } from './html-mesh'

interface Parameters {
  xr?: boolean
}

export interface Debug {
  ui: ReturnType<typeof createUI>
  update(): void
}

export const createDebugTools = (parameters: Parameters, renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): Debug => {
  const stats = createStats()
  const ui = createUI()
  let htmlMesh: HTMLMesh

  if (parameters.xr) {
    htmlMesh = createHTMLMesh(ui, renderer, scene, camera)
  }

  const update = () => {
    stats.update()

    // Canvas elements doesn't trigger DOM updates, so we have to update the texture
    htmlMesh.material.map.update()
  }

  return {
    ui,
    update,
  }
}
