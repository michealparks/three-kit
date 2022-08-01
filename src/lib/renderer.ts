import * as THREE from 'three'
import * as post from 'postprocessing'

export const renderer = new THREE.WebGLRenderer({
  powerPreference: 'high-performance',
  antialias: import.meta.env.THREE_POSTPROCESSING ? false : true,
  alpha: import.meta.env.THREE_ALPHA ?? false,
  stencil: import.meta.env.THREE_POSTPROCESSING ? false : true,
  depth: import.meta.env.THREE_POSTPROCESSING ? false : true,
})
document.body.append(renderer.domElement)

console.log(import.meta.env)
renderer.physicallyCorrectLights = true
renderer.xr.enabled = import.meta.env.THREE_XR

if (import.meta.env.THREE_SHADOW_MAP) {
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
}

renderer.outputEncoding = import.meta.env.THREE_LINEAR
  ? THREE.LinearEncoding
  : THREE.sRGBEncoding

renderer.toneMapping = import.meta.env.THREE_FLAT
  ? THREE.NoToneMapping
  : THREE.ACESFilmicToneMapping


export const resizeRendererToDisplaySize = (renderer: THREE.Renderer, camera: THREE.Camera, composer?: post.EffectComposer) => {
  const canvas = renderer.domElement
  const pixelRatio = window.devicePixelRatio
  const width = canvas.clientWidth * pixelRatio | 0
  const height = canvas.clientHeight * pixelRatio | 0
  const needResize = canvas.width !== width || canvas.height !== height

  if (needResize) {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    } else {
      camera.left = size.width / -2
      camera.right = size.width / 2
      camera.top = size.height / 2
      camera.bottom = size.height / -2
    }

    composer?.setSize(width, height, false)
    renderer.setSize(width, height, false)

    canvas.style.width = '100%'
    canvas.style.height = '100%'
  }

  return needResize
}
