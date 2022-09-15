// Inspired by http://john-chapman-graphics.blogspot.com/2013/01/good-enough-volumetrics-for-spotlights.html

import * as THREE from 'three'
import { camera } from './camera'
import { createSpotlightMaterial } from './spotlight-material'
import { update } from './update'

const m4 = new THREE.Matrix4()
const vec3 = new THREE.Vector3()
const SPOT_INTENSITY = Number.parseFloat(import.meta.env.THREE_SPOT_INTENSITY)

export const createVolumetricSpot = ({
  angle = Math.PI / 3,
  color = new THREE.Color(import.meta.env.THREE_SPOT_COLOR),
  distance = 5,
  intensity = SPOT_INTENSITY,
  opacity = 1,
  radiusTop = 0.1,
  radiusBottom = angle * 7,
  attenuation = 5,
  anglePower = 5,
  depthBuffer = null,
}: {
  angle?: number
  anglePower?: number
  attenuation?: number
  color?: THREE.Color
  distance?: number
  intensity?: number
  opacity?: number
  radiusTop?: number
  depthBuffer?: THREE.DepthTexture | null
  radiusBottom?: number
} = {}) => {
  const light = new THREE.SpotLight(color, intensity)
  const geometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    distance,
    128,
    64,
    true
  )
  geometry.applyMatrix4(m4.makeTranslation(0, -distance / 2, 0))
  geometry.applyMatrix4(m4.makeRotationX(-Math.PI / 2))

  const material = createSpotlightMaterial(
    anglePower,
    attenuation,
    camera.near,
    camera.far,
    color,
    depthBuffer,
    opacity
  )

  const mesh = new THREE.Mesh(geometry, material)
  light.add(mesh)

  update(() => {
    mesh.getWorldPosition(material.uniforms.spotPosition.value)
    mesh.lookAt((mesh.parent! as THREE.SpotLight).target.getWorldPosition(vec3))
  })

  return light
}
