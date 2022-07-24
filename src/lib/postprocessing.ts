import * as post from 'postprocessing'
import * as THREE from 'three'

export const createComposer = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => {
  const composer = new post.EffectComposer(renderer, {
    frameBufferType: THREE.HalfFloatType
  })

  const smaaEffect = new post.SMAAEffect({
    preset: post.SMAAPreset.ULTRA
  })

  const bloomEffect = new post.BloomEffect({
    height: 480,
    intensity: 1,
    kernelSize: post.KernelSize.VERY_LARGE
  })

  composer.addPass(new post.RenderPass(scene, camera))
  composer.addPass(new post.EffectPass(
    camera,
    smaaEffect,
    bloomEffect,
  ))

  return composer
}
