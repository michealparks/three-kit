import './soft-shadows'
import * as THREE from 'three'
import { camera } from './camera'
import { composer } from './postprocessing'

export const renderer = new THREE.WebGLRenderer({
  alpha: import.meta.env.THREE_ALPHA === 'true',
  antialias: import.meta.env.THREE_POSTPROCESSING !== 'true',
  depth: import.meta.env.THREE_POSTPROCESSING !== 'true',
  powerPreference: 'high-performance',
  stencil: import.meta.env.THREE_POSTPROCESSING !== 'true',
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
}

renderer.outputEncoding = import.meta.env.THREE_LINEAR === 'true'
  ? THREE.LinearEncoding
  : THREE.sRGBEncoding

renderer.toneMapping = import.meta.env.THREE_FLAT === 'true'
  ? THREE.NoToneMapping
  : THREE.ACESFilmicToneMapping

const targetDPI = Number.parseFloat(import.meta.env.THREE_TARGET_DPI)
const pixelRatio = Math.min(window.devicePixelRatio, targetDPI)

export const resizeRendererToDisplaySize = () => {
  const canvas = renderer.domElement
  const width = canvas.clientWidth * pixelRatio | 0
  const height = canvas.clientHeight * pixelRatio | 0
  const needResize = canvas.width !== width || canvas.height !== height

  if (needResize) {
    if (import.meta.env.THREE_CAMERA === 'perspective') {
      const cam = camera as THREE.PerspectiveCamera
      cam.aspect = canvas.clientWidth / canvas.clientHeight
      cam.updateProjectionMatrix()
    } else {
      // @TODO support ortho camz
      const cam = camera as THREE.OrthographicCamera
      cam.left = window.innerWidth / -2
      cam.right = window.innerWidth / 2
      cam.top = window.innerHeight / 2
      cam.bottom = window.innerHeight / -2
      cam.updateProjectionMatrix()
    }

    if (import.meta.env.THREE_POSTPROCESSING === 'true') {
      composer.setSize(width, height, false)
    }

    if (!renderer.xr.isPresenting) {
      renderer.setSize(width, height, false)
    }

    canvas.style.width = '100%'
    canvas.style.height = '100%'
  }

  return needResize
}
