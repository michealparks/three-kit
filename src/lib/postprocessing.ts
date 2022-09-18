import * as THREE from 'three'
import * as post from 'postprocessing'
import { SSREffect } from 'screen-space-reflections'
import { camera } from './camera'
import { renderer } from './renderer'
import { scene } from './scene'

export let composer: post.EffectComposer
export let smaaEffect: post.SMAAEffect
export let bloomEffect: post.BloomEffect
export let noiseEffect: post.NoiseEffect
export let dofEffect: post.DepthOfFieldEffect
export let ssrEffect: typeof SSREffect
export let vignetteEffect: post.VignetteEffect

if (import.meta.env.THREE_POSTPROCESSING === 'true') {
  composer = new post.EffectComposer(renderer, {
    frameBufferType: THREE.HalfFloatType,
  })

  if (import.meta.env.THREE_POST_MULTISAMPLING) {
    const multisampling = Number.parseFloat(import.meta.env.THREE_POST_MULTISAMPLING)
    composer.multisampling = multisampling
  }

  const effects = []

  if (import.meta.env.THREE_POST_SMAA === 'true') {
    smaaEffect = new post.SMAAEffect({
      preset: post.SMAAPreset.ULTRA,
    })
    effects.push(smaaEffect)
  }

  if (import.meta.env.THREE_POST_BLOOM === 'true') {
    const height = Number.parseFloat(import.meta.env.THREE_POST_BLOOM_HEIGHT ?? '200')
    const width = Number.parseFloat(import.meta.env.THREE_POST_BLOOM_WIDTH ?? '200')
    const intensity = Number.parseFloat(import.meta.env.THREE_POST_BLOOM_INTENSITY ?? '0.4')
    const luminanceThreshold = Number.parseFloat(
      import.meta.env.THREE_POST_BLOOM_LUMINANCE_THRESHOLD ?? '0.4')
    const luminanceSmoothing = Number.parseFloat(
      import.meta.env.THREE_POST_BLOOM_LUMINANCE_SMOOTHING ?? '0.9'
    )

    bloomEffect = new post.BloomEffect({
      height,
      intensity,
      kernelSize: post.KernelSize.VERY_LARGE,
      luminanceSmoothing,
      luminanceThreshold,
      width,
    })
    effects.push(bloomEffect)
  }

  if (import.meta.env.THREE_POST_NOISE === 'true') {
    const noiseOpacity = Number.parseFloat(import.meta.env.THREE_POST_NOISE_OPACITY ?? '0.06')

    noiseEffect = new post.NoiseEffect({
      blendFunction: post.BlendFunction.COLOR_DODGE,
    })
    noiseEffect.blendMode.opacity.value = noiseOpacity
    effects.push(noiseEffect)
  }

  if (import.meta.env.THREE_POST_VIGNETTE) {
    vignetteEffect = new post.VignetteEffect()
    vignetteEffect.technique = post.VignetteTechnique.DEFAULT
    effects.push(vignetteEffect)
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
