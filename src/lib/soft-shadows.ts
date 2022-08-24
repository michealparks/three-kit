import * as THREE from 'three'
import softShadowsShader from './soft-shadows.glsl'

const PCSS_SIZE = Number.parseFloat(import.meta.env.THREE_PCSS_SIZE)
const PCSS_FRUSTUM = Number.parseFloat(import.meta.env.THREE_PCSS_FRUSTUM)

const pcss = `#define LIGHT_WORLD_SIZE ${PCSS_SIZE}
#define LIGHT_FRUSTUM_WIDTH ${PCSS_FRUSTUM}
#define LIGHT_SIZE_UV (LIGHT_WORLD_SIZE / LIGHT_FRUSTUM_WIDTH)
#define NEAR_PLANE ${Number.parseFloat(import.meta.env.THREE_PCSS_NEAR)}
#define NUM_SAMPLES ${Number.parseInt(import.meta.env.THREE_PCSS_SAMPLES, 10)}
#define NUM_RINGS ${Number.parseInt(import.meta.env.THREE_PCSS_RINGS, 10)}
${softShadowsShader}`

let deployed = false

if (import.meta.env.THREE_SOFT_SHADOWS === 'true') {
  // Avoid adding the effect twice, which may happen in HMR scenarios
  if (!deployed) {
    deployed = true
    let shader = THREE.ShaderChunk.shadowmap_pars_fragment
    shader = shader.replace(
      '#ifdef USE_SHADOWMAP',
      `#ifdef USE_SHADOWMAP\n${pcss}`
    )
    shader = shader.replace(
      '#if defined( SHADOWMAP_TYPE_PCF )',
      '\nreturn PCSS(shadowMap, shadowCoord);\n#if defined( SHADOWMAP_TYPE_PCF )'
    )
    THREE.ShaderChunk.shadowmap_pars_fragment = shader
  }
}
