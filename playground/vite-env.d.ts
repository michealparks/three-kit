/// <reference types="vite/client" />

declare module 'screen-space-reflections'

declare module '*.glsl' {
  const value: string
  export default value
}

type GLTF = { scene: THREE.Scene }
