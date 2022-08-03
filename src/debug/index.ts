import './helpers'
import { createHTMLMesh } from './html-mesh'
import { pane, stats, fpsGraph, addPane } from './pane'

export { addPane }

if (import.meta.env.THREE_XR === 'true' && import.meta.env.THREE_XR_DEBUG_UI === 'true') {
  const uiMesh = createHTMLMesh(pane.element)
  uiMesh.position.set(-0.75, 1.5, -0.5)
  uiMesh.rotation.set(0, Math.PI / 4, 0)

  const statsMesh = createHTMLMesh(stats.element)
  statsMesh.position.set(-0.75, 1.8, -0.5)
  statsMesh.rotation.set(0, Math.PI / 4, 0)

  setInterval(() => {
    // Canvas elements doesn't trigger DOM updates, so we have to update the texture
    // @ts-ignore
    statsMesh?.material.map.update()
    // @ts-ignore
    uiMesh?.material.map.update()
  }, 1000)
}

export const update = () => {
  fpsGraph.end()
  fpsGraph.begin()
}
