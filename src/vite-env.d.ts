/// <reference types="vite/client" />

declare module 'screen-space-reflections'

declare module '*.glsl' {
  const value: string
  export default value
}

type GLTF = { scene: THREE.Scene }

declare const DIR_TEXTURES: string
declare const DIR_AUDIO: string
declare const DIR_GLB: string
declare const DIR_JSON: string
declare const DIR_FILE: string

declare const RENDERER_ALPHA: boolean
declare const RENDERER_SRGB: boolean
declare const RENDERER_TONEMAPPING: boolean
declare const RENDERER_SHADOWMAP: boolean
declare const RENDERER_SHADOWMAP_TYPE: 'basic' | 'pcf' | 'pcf_soft' | 'vsm'
declare const RENDERER_SHADOWMAP_SIZE: 128 | 256 | 512 | 1024 | 2048
declare const RENDERER_DPI: number

declare const PCSS: boolean
declare const PCSS_SIZE: number
declare const PCSS_FRUSTUM: number
declare const PCSS_NEAR: number
declare const PCSS_SAMPLES: number
declare const PCSS_RINGS: number

declare const POSTPROCESSING: boolean
declare const POST_MULTISAMPLING: number
declare const POST_SMAA: boolean
declare const POST_VIGNETTE: boolean
declare const POST_DOF: boolean
declare const POST_SSR: boolean
declare const POST_DEPTH_PASS: boolean

declare const POST_BLOOM: boolean
declare const POST_BLOOM_INTENSITY: number
declare const POST_BLOOM_HEIGHT: number
declare const POST_BLOOM_WIDTH: number
declare const POST_BLOOM_LUMINANCE_THRESHOLD: number
declare const POST_BLOOM_LUMINANCE_SMOOTHING: number

declare const POST_NOISE: boolean
declare const POST_NOISE_OPACITY: number

// https://github.com/Ameobea/three-good-godrays
declare const POST_GODRAYS: boolean

declare const CAMERA: 'perspective' | 'orthographic'
declare const CAMERA_FOV: number
declare const CAMERA_NEAR: number
declare const CAMERA_FAR: number

declare const CONTROLS: boolean
declare const CONTROLS_KEYBOARD: boolean
declare const CONTROLS_GAMEPAD: boolean

declare const MESH_UI: boolean
declare const MESH_UI_FONT: string

declare const XR_ENABLED: boolean
declare const XR_BUTTON: boolean
