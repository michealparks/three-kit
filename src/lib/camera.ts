import * as THREE from 'three'

export const createCamera = (type?: 'perspective' | 'orthographic') => {
  const camera = type === 'orthographic'
    ? new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 1000)
    : new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

  camera.lookAt(0, 0, 0)

  return camera
}
