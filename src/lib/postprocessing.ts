import * as post from 'postprocessing'
import * as THREE from 'three'
import { renderer, scene, camera } from '.'

export let composer: post.EffectComposer

if (import.meta.env.THREE_POSTPROCESSING) {
  composer = new post.EffectComposer(renderer, {
    frameBufferType: THREE.HalfFloatType
  })
  composer.multisampling = 8
  
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
}
