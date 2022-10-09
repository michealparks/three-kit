import * as THREE from 'three'
import * as post from 'postprocessing'
import { GodraysPass } from 'three-good-godrays'
import { SSREffect } from 'screen-space-reflections'
import { camera } from './camera'
import { godrayDir } from './lights'
import { renderer } from './renderer'
import { scene } from './scene'

export let composer: post.EffectComposer
export let smaaEffect: post.SMAAEffect
export let bloomEffect: post.BloomEffect
export let noiseEffect: post.NoiseEffect
export let dofEffect: post.DepthOfFieldEffect
export let ssrEffect: typeof SSREffect
export let vignetteEffect: post.VignetteEffect

export let godraysPass: GodraysPass

if (kit__POSTPROCESSING) {
  composer = new post.EffectComposer(renderer, {
    frameBufferType: THREE.HalfFloatType,
  })
  composer.multisampling = kit__POST_MULTISAMPLING ?? 0

  const effects = []

  if (kit__POST_SMAA) {
    smaaEffect = new post.SMAAEffect({
      preset: post.SMAAPreset.ULTRA,
    })
    effects.push(smaaEffect)
  }

  if (kit__POST_BLOOM) {
    bloomEffect = new post.BloomEffect({
      height: kit__POST_BLOOM_HEIGHT,
      intensity: kit__POST_BLOOM_INTENSITY,
      kernelSize: post.KernelSize.VERY_LARGE,
      luminanceSmoothing: kit__POST_BLOOM_LUMINANCE_SMOOTHING,
      luminanceThreshold: kit__POST_BLOOM_LUMINANCE_THRESHOLD,
      width: kit__POST_BLOOM_WIDTH,
    })

    effects.push(bloomEffect)
  }

  if (kit__POST_NOISE) {
    noiseEffect = new post.NoiseEffect({
      blendFunction: post.BlendFunction.COLOR_DODGE,
    })
    noiseEffect.blendMode.opacity.value = kit__POST_NOISE_OPACITY
    effects.push(noiseEffect)
  }

  if (kit__POST_VIGNETTE) {
    vignetteEffect = new post.VignetteEffect()
    vignetteEffect.technique = post.VignetteTechnique.DEFAULT
    effects.push(vignetteEffect)
  }

  if (kit__POST_DOF) {
    dofEffect = new post.DepthOfFieldEffect(camera)
    effects.push(dofEffect)
  }

  if (kit__POST_SSR) {
    ssrEffect = new SSREffect(scene, camera)
    effects.push(ssrEffect)
  }

  const perspective = camera as THREE.PerspectiveCamera
  const renderPass = new post.RenderPass(scene, camera)
  renderPass.renderToScreen = false
  composer.addPass(renderPass)

  if (kit__POST_GODRAYS) {
    godraysPass = new GodraysPass(godrayDir, perspective)
    godraysPass.renderToScreen = false
    composer.addPass(godraysPass)
  }

  const effectPass = new post.EffectPass(camera, ...effects)
  effectPass.renderToScreen = true
  composer.addPass(effectPass)
}
