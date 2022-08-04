
import * as lib from './lib'
import { renderer, composer, scene, camera, controls } from './lib'

export {
  assets,
  controls,
  lights,
  renderer,
  scene,
  camera,
  xr,
} from './lib'

export const setAnimationLoop = (fn: XRFrameRequestCallback) => {
  renderer.setAnimationLoop((time, frame) => {
    lib.resizeRendererToDisplaySize(renderer, camera, composer)

    if (import.meta.env.THREE_CONTROLS === 'true') {
      controls.update()
    }

    fn(time, frame)

    if (import.meta.env.THREE_POSTPROCESSING === 'true') {
      composer.render()
    } else {
      renderer.render(scene, camera)
    }
  })
}
