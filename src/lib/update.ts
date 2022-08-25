import * as controls from './controls'
import { camera } from './camera'
import { composer } from './postprocessing'
import { renderer } from './renderer'
import { resizeRendererToDisplaySize } from './render-to-display-size'
import { scene } from './scene'

const callbacks: XRFrameRequestCallback[] = []

const loop: XRFrameRequestCallback = (time, frame) => {
  resizeRendererToDisplaySize()

  if (import.meta.env.THREE_CONTROLS === 'true') {
    controls.update()
  }

  for (let i = 0, l = callbacks.length; i < l; i += 1) {
    callbacks[i](time, frame)
  }

  if (import.meta.env.THREE_POSTPROCESSING === 'true') {
    composer.render()
  } else {
    renderer.render(scene, camera)
  }
}

export const run = () => {
  renderer.setAnimationLoop(loop)
}

export const pause = () => {
  renderer.setAnimationLoop(null)
}

export const update = (callback: XRFrameRequestCallback) => {
  callbacks.push(callback)
}
