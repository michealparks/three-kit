import './scene-patcher'
import { createHTMLMesh } from './html-mesh'
import { pane, addPane, addFolder } from './pane'
import { stats, fpsGraph } from './pane/stats'
import { update } from '../lib'
import './scene'

export { stats }
export { addPane, addFolder }

if (
  import.meta.env.THREE_XR === 'true' &&
  import.meta.env.THREE_XR_DEBUG_UI === 'true'
) {
  const uiMesh = createHTMLMesh(pane.element)
  uiMesh.position.set(-0.75, 1.5, -0.5)
  uiMesh.rotation.set(0, Math.PI / 4, 0)

  const statsMesh = createHTMLMesh(stats.element)
  statsMesh.position.set(-0.75, 1.8, -0.5)
  statsMesh.rotation.set(0, Math.PI / 4, 0)
}

update(() => {
  // @TODO why are these not typed?
  const graph = fpsGraph as unknown as { begin(): void; end(): void }
  graph.end()
  graph.begin()
})
