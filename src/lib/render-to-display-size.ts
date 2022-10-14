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
    const aspect = canvas.clientWidth / canvas.clientHeight

    if (kit__CAMERA_PERSPECTIVE) {
      const cam = camera as THREE.PerspectiveCamera
      cam.aspect = aspect
      cam.updateProjectionMatrix()
    } else {
      const cam = camera as THREE.OrthographicCamera
      cam.left = cam.userData.size * aspect / -2
      cam.right = cam.userData.size * aspect / 2
      cam.top = cam.userData.size / 2
      cam.bottom = cam.userData.size / -2
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
