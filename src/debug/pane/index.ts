import * as panels from './panels'
import { Pane, FolderApi } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation'
import { get, set } from '../storage'

export type Panes = Pane | FolderApi

const storedState: Record<string, boolean> = get('expandedPanes')
const panes: Panes[] = []

export const addFolder = (pane: Pane | FolderApi, title: string) => {
  const folder = pane.addFolder({ title, expanded: storedState[title] ?? false })

  panes.push(folder)

  return folder
}

export const addPane = (title: string) => {
  const pane = new Pane()
  pane.registerPlugin(EssentialsPlugin)
  pane.registerPlugin(RotationPlugin)
  pane.element.classList.add('pane')
  pane.element.parentElement!.style.width = '300px';
  panels.addPanelEntry(title, pane)

  return pane
}

export const addTransformInputs = (pane: Pane | FolderApi, object3D: THREE.Object3D) => {
  const params = {
    position: object3D.position,
    rotation: object3D.quaternion,
  }

  pane.addInput(params, 'position', { step: 0.1 })
  pane.addInput(params, 'rotation', { view: 'rotation', picker: 'inline' })
}

export const pane = addPane('world')
panels.selectPanel('world')

export const stats = new Pane()
stats.registerPlugin(EssentialsPlugin)
stats.element.parentElement!.classList.add('pane-left')

const mb = 1_048_576
const { memory } = performance as unknown as { memory: undefined | {
  usedJSHeapSize: number
  jsHeapSizeLimit: number
} }

const statsParams = {
  memory: memory ? memory.usedJSHeapSize / mb : 0
}

export const fpsGraph = stats.addBlade({
  view: 'fpsgraph',
  label: 'fps',
  lineCount: 2,
});


if (memory) {
  stats.addMonitor(statsParams, 'memory', {
    view: 'graph',
    min: 0,
    max: memory.jsHeapSizeLimit / mb,
  });

  setInterval(() => {
    statsParams.memory = memory.usedJSHeapSize / mb
  }, 3000)
}

window.onbeforeunload = () => {
  const state: Record<string, boolean> = {}
  for (const pane of panes) {
    state[pane.title!] = pane.expanded
  }

  set('expandedPanes', state)
}

document.addEventListener('keypress', (event) => {
  if (event.shiftKey === false) {
    return
  }

  switch (event.key.toLowerCase()) {
    case 'a':
      if (pane.element.style.transform) {
        panels.element.style.transform = ''
        pane.element.style.transform = ''
      } else {
        panels.element.style.transform = 'translate(0, -150%)'
        pane.element.style.transform = 'translate(110%, 0)'
      }
      break
    
    case '~':
      break
  }
})
