
import * as lib from './lib'
import { renderer, composer, scene, camera } from './lib'

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

    fn(time, frame)

    if (import.meta.env.THREE_POSTPROCESSING === 'true') {
      composer.render()
    } else {
      renderer.render(scene, camera)
    }
  })
}
