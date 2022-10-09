import * as THREE from 'three'
import { scene } from './scene'

export const camera = kit__CAMERA_PERSPECTIVE
  ? new THREE.PerspectiveCamera(
    kit__CAMERA_FOV,
    window.innerWidth / window.innerHeight,
    kit__CAMERA_NEAR,
    kit__CAMERA_FAR
  )
  : new THREE.OrthographicCamera(
    kit__CAMERA_ORTHO_WIDTH / -2,
    kit__CAMERA_ORTHO_WIDTH / +2,
    kit__CAMERA_ORTHO_HEIGHT / +2,
    kit__CAMERA_ORTHO_HEIGHT / -2,
    kit__CAMERA_NEAR,
    kit__CAMERA_FAR
  )

camera.name = 'defaultCamera'

export const user = new THREE.Group()
user.add(camera)
scene.add(user)
