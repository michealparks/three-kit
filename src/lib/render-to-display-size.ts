import { camera } from './camera'
import { composer } from './postprocessing'
import { renderer } from './renderer'

const pixelRatio = Math.min(window.devicePixelRatio, kit__RENDERER_DPI ?? window.devicePixelRatio)

export const resizeRendererToDisplaySize = () => {
  const canvas = renderer.domElement
  const width = canvas.clientWidth * pixelRatio | 0
  const height = canvas.clientHeight * pixelRatio | 0
  const needResize = canvas.width !== width || canvas.height !== height

  if (needResize) {
    if (kit__CAMERA_PERSPECTIVE) {
      const cam = camera as THREE.PerspectiveCamera
      cam.aspect = canvas.clientWidth / canvas.clientHeight
      cam.updateProjectionMatrix()
    } else {
      const cam = camera as THREE.OrthographicCamera
      cam.left = window.innerWidth / -2
      cam.right = window.innerWidth / 2
      cam.top = window.innerHeight / 2
      cam.bottom = window.innerHeight / -2
      cam.updateProjectionMatrix()
    }

    if (kit__POSTPROCESSING) {
      composer.setSize(width, height, false)
    }

    if (!renderer.xr.isPresenting) {
      renderer.setSize(width, height, false)
    }
  }
}
