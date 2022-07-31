import { Pane, FolderApi } from 'tweakpane'
import { get, set } from './storage'

export type Panes = Pane | FolderApi

const storedState: Record<string, boolean> = get('expandedPanes')
const panes: Panes[] = []

window.onbeforeunload = (e) => {
  const state: Record<string, boolean> = {}
  for (const pane of panes) {
    state[pane.title!] = pane.expanded
  }

  set('expandedPanes', state)
}

export const create = () => {
  return new Pane()
}

export const addFolder = (pane: Pane | FolderApi, title: string) => {
  const folder = pane.addFolder({ title, expanded: storedState[title] ?? false })

  panes.push(folder)

  return folder
}

export const addTransformInputs = (pane: Pane | FolderApi, object3D: THREE.Object3D) => {
  const params = {
    position: object3D.position,
    rotation: object3D.quaternion,
  }

  pane.addInput(params, 'position', { step: 0.1 })
  pane.addInput(params, 'rotation', { step: 0.01 })
}
