### Configuration

env.ts file:
```ts
export default {
  DIR_TEXTURES: 'textures',
  DIR_AUDIO: 'audio',
  DIR_GLB: 'glb',
  DIR_JSON: 'json',
  DIR_FILE: 'file',

  RENDERER_ALPHA: false,
  RENDERER_SRGB: true,
  RENDERER_TONEMAPPING: true,
  RENDERER_SHADOWMAP: true,
  RENDERER_SHADOWMAP_SIZE: 2048,
  RENDERER_DPI: 1.5,

  // Soft shadows
  PCSS: false,
  PCSS_SIZE: 0.005,
  PCSS_FRUSTUM: 3.75,
  PCSS_NEAR: 9.5,
  PCSS_SAMPLES: 10,
  PCSS_RINGS: 3,

  // https://github.com/pmndrs/postprocessing
  POSTPROCESSING: true,
  POST_MULTISAMPLING: 2,
  POST_SMAA: true,
  POST_DEPTH_PASS: false,
  POST_BLOOM: true,
  POST_BLOOM_INTENSITY: 1,
  POST_BLOOM_HEIGHT: 200,
  POST_BLOOM_WIDTH: 200,
  POST_BLOOM_LUMINANCE_THRESHOLD: 0.4,
  POST_BLOOM_LUMINANCE_SMOOTHING: 0.9,

  POST_NOISE: true,
  POST_NOISE_OPACITY: 0.06,

  // https://github.com/Ameobea/three-good-godrays
  POST_GODRAYS: true,

  POST_VIGNETTE: true,
  POST_DOF: false,
  POST_SSR: false,

  CAMERA: 'perspective',
  CAMERA_FOV: 75,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 100,
  CAMERA_ORTHO_WIDTH: 4,
  CAMERA_ORTHO_HEIGHT: 2,

  CONTROLS: true,
  CONTROLS_KEYBOARD: true,
  CONTROLS_GAMEPAD: true,

  MESH_UI: false,
  MESH_UI_FONT: '/pixeloid-sans',

  XR_ENABLED: false,
  XR_BUTTON: false,
}
```
