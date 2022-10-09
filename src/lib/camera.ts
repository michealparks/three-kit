import * as THREE from 'three'
import { scene } from './scene'

export const camera = CAMERA === 'orthographic'
  ? new THREE.OrthographicCamera(0, 0, 0, 0, CAMERA_NEAR, CAMERA_FAR)
  : new THREE.PerspectiveCamera(
    CAMERA_FOV,
    window.innerWidth / window.innerHeight,
    CAMERA_NEAR,
    CAMERA_FAR
  )

camera.name = 'defaultCamera'

export const user = new THREE.Group()
user.add(camera)
scene.add(user)
