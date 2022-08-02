import * as THREE from 'three'
import * as post from 'postprocessing'
import { softShadows } from './soft-shadows'

softShadows({
  frustum: 1.75,
  size: 0.005,
  near: 2.5,
  samples: 10,
  rings: 1, // Rings (default: 11) must be a int
})

export const renderer = new THREE.WebGLRenderer({
  powerPreference: 'high-performance',
  antialias: import.meta.env.THREE_POSTPROCESSING === 'true' ? false : true,
  alpha: import.meta.env.THREE_ALPHA === 'true' ? true : false,
  stencil: import.meta.env.THREE_POSTPROCESSING === 'true' ? false : true,
  depth: import.meta.env.THREE_POSTPROCESSING === 'true' ? false : true,
})
document.body.append(renderer.domElement)

renderer.physicallyCorrectLights = true
renderer.xr.enabled = import.meta.env.THREE_XR === 'true'

if (import.meta.env.THREE_SHADOW_MAP === 'true') {
  renderer.shadowMap.enabled = true

  const type = import.meta.env.THREE_SHADOW_MAP_TYPE ?? 'basic'

  if (type === 'basic') {
    renderer.shadowMap.type = THREE.BasicShadowMap
  } else if (type === 'pcf') {
    renderer.shadowMap.type = THREE.PCFShadowMap
  } else if (type === 'pcf_soft') {
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
  } else if (type === 'vsm') {
    renderer.shadowMap.type = THREE.VSMShadowMap
  }

  console.log(renderer.shadowMap.type)
}

renderer.outputEncoding = import.meta.env.THREE_LINEAR === 'true'
  ? THREE.LinearEncoding
  : THREE.sRGBEncoding

renderer.toneMapping = import.meta.env.THREE_FLAT === 'true'
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
