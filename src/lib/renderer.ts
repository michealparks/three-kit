import './soft-shadows'
import * as THREE from 'three'

export const renderer = new THREE.WebGLRenderer({
  alpha: kit__RENDERER_ALPHA,
  antialias: !kit__POSTPROCESSING,
  depth: !kit__POSTPROCESSING,
  powerPreference: 'high-performance',
  stencil: !kit__POSTPROCESSING,
})

renderer.debug.checkShaderErrors = kit__checkShaderErrors
renderer.physicallyCorrectLights = kit__physicallyCorrectLights
renderer.xr.enabled = kit__XR_ENABLED

renderer.outputEncoding = kit__RENDERER_SRGB
  ? THREE.sRGBEncoding
  : THREE.LinearEncoding

renderer.toneMapping = kit__RENDERER_TONEMAPPING
  ? THREE.ACESFilmicToneMapping
  : THREE.NoToneMapping

if (kit__RENDERER_SHADOWMAP) {
  renderer.shadowMap.enabled = true

  switch (kit__RENDERER_SHADOWMAP_TYPE) {
  case 'pcf':
    renderer.shadowMap.type = THREE.PCFShadowMap
    break
  case 'pcf_soft':
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    break
  case 'vsm':
    renderer.shadowMap.type = THREE.VSMShadowMap
    break
  default:
    renderer.shadowMap.type = THREE.BasicShadowMap
    break
  }
}

document.body.append(renderer.domElement)
