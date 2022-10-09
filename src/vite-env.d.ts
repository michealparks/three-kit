/// <reference types="vite/client" />

declare module 'screen-space-reflections'

declare module '*.glsl' {
  const value: string
  export default value
}

type GLTF = { scene: THREE.Scene }

declare const kit__DIR_TEXTURES: string
declare const kit__DIR_AUDIO: string
declare const kit__DIR_GLB: string
declare const kit__DIR_JSON: string
declare const kit__DIR_FILE: string

declare const kit__RENDERER_ALPHA: boolean
declare const kit__RENDERER_SRGB: boolean
declare const kit__RENDERER_TONEMAPPING: boolean
declare const kit__RENDERER_SHADOWMAP: boolean
declare const kit__RENDERER_SHADOWMAP_TYPE: 'basic' | 'pcf' | 'pcf_soft' | 'vsm'
declare const kit__RENDERER_SHADOWMAP_SIZE: 128 | 256 | 512 | 1024 | 2048
declare const kit__RENDERER_DPI: number

declare const kit__PCSS: boolean
declare const kit__PCSS_SIZE: number
declare const kit__PCSS_FRUSTUM: number
declare const kit__PCSS_NEAR: number
declare const kit__PCSS_SAMPLES: number
declare const kit__PCSS_RINGS: number

declare const kit__POSTPROCESSING: boolean
declare const kit__POST_MULTISAMPLING: number
declare const kit__POST_SMAA: boolean
declare const kit__POST_VIGNETTE: boolean
declare const kit__POST_DOF: boolean
declare const kit__POST_SSR: boolean
declare const kit__POST_DEPTH_PASS: boolean

declare const kit__POST_BLOOM: boolean
declare const kit__POST_BLOOM_INTENSITY: number
declare const kit__POST_BLOOM_HEIGHT: number
declare const kit__POST_BLOOM_WIDTH: number
declare const kit__POST_BLOOM_LUMINANCE_THRESHOLD: number
declare const kit__POST_BLOOM_LUMINANCE_SMOOTHING: number

declare const kit__POST_NOISE: boolean
declare const kit__POST_NOISE_OPACITY: number

// https://github.com/Ameobea/three-good-godrays
declare const kit__POST_GODRAYS: boolean

declare const kit__CAMERA_PERSPECTIVE: boolean
declare const kit__CAMERA_FOV: number
declare const kit__CAMERA_NEAR: number
declare const kit__CAMERA_FAR: number
declare const kit__CAMERA_ORTHO_WIDTH: number
declare const kit__CAMERA_ORTHO_HEIGHT: number

declare const kit__CONTROLS: boolean
declare const kit__CONTROLS_KEYBOARD: boolean
declare const kit__CONTROLS_GAMEPAD: boolean

declare const kit__MESH_UI: boolean
declare const kit__MESH_UI_FONT: string

declare const kit__XR_ENABLED: boolean
declare const kit__XR_BUTTON: boolean
