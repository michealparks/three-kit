import * as THREE from 'three'
import * as post from 'postprocessing'
import { SSREffect } from 'screen-space-reflections'
import { camera } from './camera'
import { renderer } from './renderer'
import { scene } from './scene'


export let composer: post.EffectComposer
export let smaaEffect: post.SMAAEffect
export let bloomEffect: post.BloomEffect
export let dofEffect: post.DepthOfFieldEffect
export let ssrEffect: typeof SSREffect

if (import.meta.env.THREE_POSTPROCESSING === 'true') {
  composer = new post.EffectComposer(renderer, {
    frameBufferType: THREE.HalfFloatType,
  })
  // ? composer.multisampling = 8

  const effects = []

  if (import.meta.env.THREE_POST_SMAA === 'true') {
    smaaEffect = new post.SMAAEffect({
      preset: post.SMAAPreset.ULTRA,
    })
    effects.push(smaaEffect)
  }

  if (import.meta.env.THREE_POST_BLOOM === 'true') {
    bloomEffect = new post.BloomEffect({
      height: 480,
      intensity: 20,
      kernelSize: post.KernelSize.VERY_LARGE,
      width: 480,
    })
    effects.push(bloomEffect)
  }

  if (import.meta.env.THREE_POST_DOF === 'true') {
    dofEffect = new post.DepthOfFieldEffect(camera)
    effects.push(dofEffect)
  }

  if (import.meta.env.THREE_POST_SSR === 'true') {
    ssrEffect = new SSREffect(scene, camera)
    effects.push(ssrEffect)
  }

  composer.addPass(new post.RenderPass(scene, camera))
  composer.addPass(new post.EffectPass(camera, ...effects))
}
