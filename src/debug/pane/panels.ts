import css from './index.css'
import type { Pane } from 'tweakpane'

const style = document.createElement('style')
style.innerHTML = css
document.head.append(style)

let selected: HTMLElement | undefined
let selectedButton: HTMLButtonElement | undefined

export const element = document.createElement('div')
element.className = 'panels tp-rotv'
document.body.append(element)

const paneMap = new Map<string, Pane>()

const createButton = (title: string) => {
  const button = document.createElement('button')
  button.className = 'tp-fldv_b panels-button'
  button.dataset.title = title
  button.textContent = title
  button.addEventListener('click', () => selectPanel(title))
  return button
}

export const selectPanel = (title: string) => {
  selected?.classList.add('hidden')
  selectedButton?.classList.remove('selected')

  selectedButton = element.querySelector<HTMLButtonElement>(`[data-title="${title}"]`)!
  selectedButton.classList.add('selected')

  selected = paneMap.get(title)!.element
  selected.classList.remove('hidden')

}

export const addPanelEntry = (title: string, pane: Pane) => {
  paneMap.set(title, pane)
  element.append(createButton(title))
  pane.element.classList.add('hidden')
}
