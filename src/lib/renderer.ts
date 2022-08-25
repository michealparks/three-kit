import './soft-shadows'
import * as THREE from 'three'

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
