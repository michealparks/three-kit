import * as THREE from 'three'
import * as post from "postprocessing";

export const createRenderer = (parameters: THREE.WebGLRendererParameters = {}) => {
  return new THREE.WebGLRenderer({
    canvas: parameters.canvas,
    powerPreference: 'high-performance',
    antialias: parameters.antialias ?? false,
    alpha: parameters.alpha ?? false,
    // depth: parameters.depth ?? false,
    // stencil: parameters.stencil ?? false,
  })  
}

export const resizeRendererToDisplaySize = (renderer: THREE.Renderer, camera: THREE.Camera, composer?: post.EffectComposer) => {
  const canvas = renderer.domElement
  const pixelRatio = window.devicePixelRatio;
  const width = canvas.clientWidth * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height

  if (needResize) {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    composer?.setSize(width, height, false)
    renderer.setSize(width, height, false)

    canvas.style.width = '100%'
    canvas.style.height = '100%'
  }

  return needResize
}
