import * as THREE from 'three'
import { scene } from './scene'

export const camera = import.meta.env.THREE_CAMERA === 'orthographic'
  ? new THREE.OrthographicCamera(
    0,
    0,
    0,
    0,
    Number.parseFloat(import.meta.env.THREE_CAMERA_NEAR),
    Number.parseFloat(import.meta.env.THREE_CAMERA_FAR)
  )
  : new THREE.PerspectiveCamera(
    Number.parseFloat(import.meta.env.THREE_CAMERA_FOV),
    window.innerWidth / window.innerHeight,
    Number.parseFloat(import.meta.env.THREE_CAMERA_NEAR),
    Number.parseFloat(import.meta.env.THREE_CAMERA_FAR)
  )

camera.name = 'defaultCamera'

export const user = new THREE.Group()
user.add(camera)
scene.add(user)
