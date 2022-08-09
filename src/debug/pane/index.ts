import * as panels from './panels'
import { Pane, FolderApi } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation'
import { save, storage } from '../storage'

export type Panes = Pane | FolderApi

const savedSelectedPanelTitle = storage.selectedPanelTitle
const storedState: Record<string, boolean> = storage.expandedPanes
const panes: Panes[] = []
const paneContainers: HTMLElement[] = []

let isVisible = true

export const addFolder = (pane: Pane | FolderApi, title: string, index?: number) => {
  const folder = pane.addFolder({
    title,
    index,
    expanded: storedState[title] ?? false,
  })

  panes.push(folder)

  return folder
}

export const addPane = (title: string) => {
  const pane = new Pane()
  pane.registerPlugin(EssentialsPlugin)
  pane.registerPlugin(RotationPlugin)
  pane.element.classList.add('pane')

  const parent = pane.element.parentElement!
  parent.style.transition = 'transform 300ms'
  parent.style.width = '300px'
  paneContainers.push(parent)
  panels.addPanelEntry(title, pane)

  if (savedSelectedPanelTitle === title) {
    panels.selectPanel(title)
  }

  return pane
}

export const pane = addPane('world')
if (!savedSelectedPanelTitle) {
  panels.selectPanel('world')
}

window.onbeforeunload = () => {
  const state: Record<string, boolean> = {}
  for (const pane of panes) {
    state[pane.title!] = pane.expanded
  }

  save('expandedPanes', state)
}

export const state = { controlling: false }

pane.element.addEventListener('mousedown', () => {
  state.controlling = true
})
pane.element.addEventListener('mouseup', () => {
  state.controlling = false
})

document.addEventListener('keypress', (event) => {
  if (event.shiftKey === false) {
    return
  }

  switch (event.key.toLowerCase()) {
    case 'a':
      for (const element of paneContainers) {
        element.style.transform = isVisible ? 'translate(110%, 0)' : ''
      }
      panels.element.style.transform = isVisible ? 'translate(0, -150%)' : ''
      isVisible = !isVisible
      break

    case '~':
      panels.selectPreviousPanel()
      break

    case '!':
      panels.selectNextPanel()
      break
  }
})
