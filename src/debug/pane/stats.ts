import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import { renderer, update } from '../../lib'
import { addFolder } from '.'

export const stats = new Pane()
stats.registerPlugin(EssentialsPlugin)
stats.element.parentElement!.classList.add('pane-left')

const mb = 1_048_576
const { memory } = performance as unknown as { memory: undefined | {
  usedJSHeapSize: number
  jsHeapSizeLimit: number
} }

const parameters = {
  time: '',
  memory: memory ? memory.usedJSHeapSize / mb : 0
}

const start = performance.now()
let total = 0

const updateTime = () => {
  const now = performance.now()
  total = (now - start) / 1000 

  const seconds = (total % 60) | 0
  const minutes = (total / 60) | 0
  const hours = (total / 60 / 60) | 0

  parameters.time = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

updateTime()
setInterval(updateTime, 1000)

stats.addMonitor(parameters, 'time', {
  interval: 1000,
})

export const fpsGraph = stats.addBlade({
  view: 'fpsgraph',
  label: 'fps',
  lineCount: 2,
})

if (memory) {
  stats.addMonitor(parameters, 'memory', {
    view: 'graph',
    min: 0,
    max: memory.jsHeapSizeLimit / mb,
  })

  setInterval(() => {
    parameters.memory = memory.usedJSHeapSize / mb
  }, 3000)
}

if (import.meta.env.THREE_POSTPROCESSING === 'true') {
  // add message about unsupported
} else {
  const folder = addFolder(stats, 'renderer')
  folder.addMonitor(renderer.info.memory, 'geometries', { interval: 3_000 })
  folder.addMonitor(renderer.info.memory, 'textures', { interval: 3_000 })
  folder.addMonitor(renderer.info.render, 'calls', { interval: 3_000 })
  folder.addMonitor(renderer.info.render, 'lines', { interval: 3_000 })
  folder.addMonitor(renderer.info.render, 'points', { interval: 3_000 })
  folder.addMonitor(renderer.info.render, 'triangles', { interval: 3_000 })
}

update(() => {
  // @TODO why are these not typed?
  const graph = fpsGraph as unknown as { begin(): void; end(): void }
  graph.end()
  graph.begin()
})
