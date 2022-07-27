
import type { EffectComposer } from 'postprocessing'
import * as THREE from 'three'
import * as lib from './lib'
import { scene } from './lib/scene'

export { assets, lights, xr, scene } from './lib'
export { createDebugTools } from './debug'

export const threekit = (parameters: {
  canvas?: HTMLCanvasElement
  antialias?: boolean
  camera?: 'perspective' | 'orthographic'
  xr?: boolean
  shadowMap?: boolean
  linear?: boolean
  flat?: boolean
  post?: boolean
}) => {
  let composer: EffectComposer

  const camera = lib.createCamera(parameters.camera)
  const renderer = lib.createRenderer({
    antialias: parameters.antialias,
    canvas: parameters.canvas,
  })
  renderer.physicallyCorrectLights = true

  const setAnimationLoop = (fn: XRFrameRequestCallback) => {
    renderer.setAnimationLoop((time, frame) => {
      lib.resizeRendererToDisplaySize(renderer, camera, composer)

      fn(time, frame)

      if (parameters.post) {
        composer.render()
      } else {
        renderer.render(scene, camera)
      }
    })
  }

  if (parameters.post) {
    composer = lib.createComposer(renderer, scene, camera)
  }

  if (parameters.xr === true) {
    renderer.xr.enabled = true
    lib.xr.registerSessionGrantedListener()
  }

  if (parameters.shadowMap === true) {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  renderer.outputEncoding = parameters.linear === true
    ? THREE.LinearEncoding
    : THREE.sRGBEncoding

  renderer.toneMapping = parameters.flat === true
    ? THREE.NoToneMapping
    : THREE.ACESFilmicToneMapping

  return {
    camera,
    renderer,
    setAnimationLoop,
  }
}
