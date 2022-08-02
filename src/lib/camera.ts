import * as THREE from 'three'

console.log(import.meta.env.THREE_CAMERA)
export const camera = import.meta.env.THREE_CAMERA === 'orthographic'
? new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 1000)
: new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

camera.lookAt(0, 0, 0)
