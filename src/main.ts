
import type { EffectComposer } from 'postprocessing'
import * as THREE from 'three'
import * as lib from './lib'
import { createDebugTools, Debug } from './debug'

interface Parameters {
  canvas?: HTMLCanvasElement
  antialias?: boolean
  camera?: 'perspective' | 'orthographic'
  xr?: boolean
  shadowMap?: boolean
  linear?: boolean
  flat?: boolean
  post?: boolean
  debug?: boolean
}

export const threekit = (parameters: Parameters) => {
  let xrSupported = false
  let composer: EffectComposer
  let debug: Debug

  const scene = lib.createScene()
  const camera = lib.createCamera(parameters.camera)
  const renderer = lib.createRenderer({
    antialias: parameters.antialias,
    canvas: parameters.canvas,
  })
  renderer.physicallyCorrectLights = true

  if (parameters.post) {
    composer = lib.createComposer(renderer, scene, camera)
  }

  if (parameters.xr === true) {
    renderer.xr.enabled = true
    xrSupported = lib.registerSessionGrantedListener()
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

  const xr = xrSupported
    ? {
      requestSession: () => lib.requestSession(renderer),
      endSession: lib.endSession,
    }
    : undefined

  if (parameters.debug) {
    debug = createDebugTools(parameters, renderer, scene, camera)
  }

  const setAnimationLoop = (fn: XRFrameRequestCallback) => {
    renderer.setAnimationLoop((time, frame) => {
      lib.resizeRendererToDisplaySize(renderer, camera, composer)

      fn(time, frame)

      if (parameters.post) {
        composer.render()
      } else {
        renderer.render(scene, camera)
      }

      debug?.update()
    })
  }

  return {
    debug,
    scene,
    camera,
    renderer,
    xr,
    setAnimationLoop,
  }
}
