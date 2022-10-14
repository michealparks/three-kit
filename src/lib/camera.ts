import * as THREE from 'three'
import { scene } from './scene'

const aspect = window.innerWidth / window.innerHeight

export const camera = kit__CAMERA_PERSPECTIVE
  ? new THREE.PerspectiveCamera(
    kit__CAMERA_FOV,
    aspect,
    kit__CAMERA_NEAR,
    kit__CAMERA_FAR
  )
  : new THREE.OrthographicCamera(
    kit__CAMERA_ORTHO_SIZE * aspect / -2,
    kit__CAMERA_ORTHO_SIZE * aspect / 2,
    kit__CAMERA_ORTHO_SIZE / 2,
    kit__CAMERA_ORTHO_SIZE / -2,
    kit__CAMERA_NEAR,
    kit__CAMERA_FAR
  )

if (!kit__CAMERA_PERSPECTIVE) {
  camera.userData.size = kit__CAMERA_ORTHO_SIZE
}

camera.name = 'defaultCamera'

export const user = new THREE.Group()
user.add(camera)
scene.add(user)
