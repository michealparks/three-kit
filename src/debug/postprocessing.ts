import { bloomEffect, ssrEffect } from '../lib/postprocessing'
import { pane, addFolder } from './pane'

if (import.meta.env.THREE_POSTPROCESSING === 'true') {
  const folder = addFolder(pane, 'postprocessing')

  if (import.meta.env.THREE_POST_BLOOM === 'true') {
    bloomEffect.setSize(window.innerWidth, window.innerHeight)
    const bloomFolder = addFolder(folder, 'bloom')
    bloomFolder.addInput(bloomEffect, 'intensity')
    bloomFolder.addInput
  }

  if (import.meta.env.THREE_POST_SSR === 'true') {
    const ssrFolder = addFolder(folder, 'ssr')
    ssrFolder.addInput(ssrEffect, 'intensity', { min: 0, max: 3, step: 0.01 })
    ssrFolder.addInput(ssrEffect, 'exponent', { min: 0.125, max: 8, step: 0.125 })
    ssrFolder.addInput(ssrEffect, 'distance', { min: 0.001, max: 10, step: 0.1 })
    ssrFolder.addInput(ssrEffect, 'fade', { min: 0, max: 20, step: 0.01 })
    ssrFolder.addInput(ssrEffect, 'roughnessFade', { min: 0, max: 1, step: 0.01 })
    ssrFolder.addInput(ssrEffect, 'thickness', { min: 0, max: 10, step: 0.01 })
    ssrFolder.addInput(ssrEffect, 'ior', { min: 1, max: 2.33333, step: 0.01 })
    ssrFolder.addInput(ssrEffect, 'maxRoughness', { min: 0, max: 1, step: 0.01 })
    ssrFolder.addInput(ssrEffect, 'maxDepthDifference', { min: 0, max: 100, step: 0.1 })

    const temporalResolveFolder = addFolder(ssrFolder, 'Temporal Resolve')
		temporalResolveFolder.addInput(ssrEffect, 'blend', { min: 0, max: 1, step: 0.001 })
		temporalResolveFolder.addInput(ssrEffect, 'correction', { min: 0, max: 1, step: 0.0001 })
		temporalResolveFolder.addInput(ssrEffect, 'correctionRadius', { min: 1, max: 4, step: 1 })

		const blurFolder = addFolder(ssrFolder, 'Blur')
		blurFolder.addInput(ssrEffect, 'blur', { min: 0, max: 1, step: 0.01 })
		blurFolder.addInput(ssrEffect, 'blurKernel', { min: 0, max: 5, step: 1 })
		blurFolder.addInput(ssrEffect, 'blurSharpness', { min: 0, max: 100, step: 1 })

		const jitterFolder = addFolder(ssrFolder, 'Jitter')
		jitterFolder.addInput(ssrEffect, 'jitter', { min: 0, max: 4, step: 0.01 })
		jitterFolder.addInput(ssrEffect, 'jitterRoughness', { min: 0, max: 4, step: 0.01 })

		const definesFolder = addFolder(ssrFolder, 'Tracing')
		definesFolder.addInput(ssrEffect, 'steps', { min: 1, max: 256, step: 1 })
		definesFolder.addInput(ssrEffect, 'refineSteps', { min: 0, max: 16, step: 1 })
		definesFolder.addInput(ssrEffect, 'missedRays')

		const resolutionFolder = addFolder(ssrFolder, 'Resolution')
		resolutionFolder.addInput(ssrEffect, 'resolutionScale', { min: 0.125, max: 1, step: 0.125 })
		resolutionFolder.addInput(ssrEffect, 'velocityResolutionScale', { min: 0.125, max: 1, step: 0.125 })
  }
}
