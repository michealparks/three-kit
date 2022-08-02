import type { HTMLMesh } from 'three/examples/jsm/interactive/HTMLMesh'
import { createStats } from './stats'
import { createHTMLMesh } from './html-mesh'
import { addHelpersFolder } from './helpers'
import { addRendererFolder } from './renderer'
import { pane, addFolder } from './pane'

addHelpersFolder(pane)
addRendererFolder(pane)

export const ui = addFolder(pane, 'game')
const stats = createStats()

let uiMesh: HTMLMesh | undefined
let statsMesh: HTMLMesh | undefined

if (import.meta.env.THREE_XR === 'true' && import.meta.env.THREE_XR_DEBUG_UI === 'true') {
  uiMesh = createHTMLMesh(pane.element)
  uiMesh.position.set(-0.75, 1.5, -0.5)
  uiMesh.rotation.set(0, Math.PI / 4, 0)

  statsMesh = createHTMLMesh(stats.dom)
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
  stats.update()
}
