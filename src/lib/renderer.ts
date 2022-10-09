import './soft-shadows'
import * as THREE from 'three'

export const renderer = new THREE.WebGLRenderer({
  alpha: RENDERER_ALPHA,
  antialias: !POSTPROCESSING,
  depth: !POSTPROCESSING,
  powerPreference: 'high-performance',
  stencil: !POSTPROCESSING,
})

renderer.physicallyCorrectLights = true
renderer.xr.enabled = XR_ENABLED

renderer.outputEncoding = RENDERER_SRGB
  ? THREE.sRGBEncoding
  : THREE.LinearEncoding

renderer.toneMapping = RENDERER_TONEMAPPING
  ? THREE.ACESFilmicToneMapping
  : THREE.NoToneMapping

if (RENDERER_SHADOWMAP) {
  renderer.shadowMap.enabled = true

  const type = RENDERER_SHADOWMAP_TYPE

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

document.body.append(renderer.domElement)
