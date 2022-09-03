import * as THREE from 'three'
import {
  XRControllerModelFactory
} from 'three/examples/jsm/webxr/XRControllerModelFactory'
import { renderer } from './renderer'
import { scene } from './scene'
import { update } from './update'

const m4 = new THREE.Matrix4()

let baseReferenceSpace: XRReferenceSpace | null

renderer.xr.addEventListener('sessionstart', () => {
  baseReferenceSpace = renderer.xr.getReferenceSpace()
})

const fragmentShader = `
varying vec2 vUv;
void main(){
  float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
  gl_FragColor = vec4(strength);
}`

const vertexShader = `
varying vec2 vUv;
void main(){
  vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

export const addXrTeleport = (
  navMesh: THREE.Mesh,
  geometry = new THREE.PlaneGeometry(0.5, 0.5).rotateX(-Math.PI / 2),
  material = new THREE.ShaderMaterial({
    fragmentShader,
    vertexShader,
  })
) => {
  material.transparent = true
  material.polygonOffset = true
  material.polygonOffsetFactor = -1.0

  const marker = new THREE.Mesh(geometry, material)
  marker.name = 'Teleport Marker'
  marker.visible = false
  scene.add(marker)

  // @TODO replace with BVH
  const raycaster = new THREE.Raycaster()
  const raylines: THREE.Line[] = []
  const controllers: THREE.XRTargetRaySpace[] = []
  const controllerModelFactory = new XRControllerModelFactory()

  let selecting = -1
  let intersection: THREE.Vector3 | undefined

  const handleSelectStart = (event: { target: THREE.Object3D }) => {
    selecting = event.target.userData.index
    raylines[selecting].visible = true
  }

  const handleSelectEnd = (event: { target: THREE.Object3D }) => {
    const { index } = event.target.userData

    if (selecting === index) {
      selecting = -1
    }

    raylines[index].visible = false

    if (intersection !== undefined) {
      const offsetPosition = {
        w: 1,
        x: -intersection.x,
        y: -intersection.y,
        z: -intersection.z,
      }
      const offsetRotation = new THREE.Quaternion()
      const transform = new XRRigidTransform(offsetPosition, offsetRotation)
      const teleportSpaceOffset = baseReferenceSpace!.getOffsetReferenceSpace(transform)

      renderer.xr.setReferenceSpace(teleportSpaceOffset)
    }
  }

  for (let i = 0; i < 2; i += 1) {
    const lineGeometry = new THREE.BufferGeometry()
    const lineMaterial = new THREE.LineBasicMaterial({
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    })

    lineGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3)
    )
    lineGeometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3)
    )

    const line = new THREE.Line(lineGeometry, lineMaterial)
    line.name = `XR Controller ${i} Ray Line`
    line.visible = false

    raylines.push(line)

    const controller = renderer.xr.getController(i)
    controller.addEventListener('selectstart', handleSelectStart)
    controller.addEventListener('selectend', handleSelectEnd)
    controller.addEventListener('connected', () => {
      controller.add(line)
    })
    controller.addEventListener('disconnected', () => {
      controller.remove(controller.children[0])
    })
    controller.name = `XR Controller ${i + 1}`
    controller.userData.index = i
    scene.add(controller)
    controllers.push(controller)

    const controllerGrip = renderer.xr.getControllerGrip(i)
    controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip))
    controllerGrip.name = `XR Controller Grip ${i + 1}`
    scene.add(controllerGrip)
  }

  const dispose = () => {
    /** TODO */
  }

  update(() => {
    intersection = undefined

    if (selecting > -1) {
      const activeController = controllers[selecting]
      m4.identity().extractRotation(activeController.matrixWorld)
      raycaster.ray.origin.setFromMatrixPosition(activeController.matrixWorld)
      raycaster.ray.direction.set(0, 0, -1).applyMatrix4(m4)
      const intersects = raycaster.intersectObjects([navMesh])

      if (intersects.length > 0) {
        intersection = intersects[0].point
      }

      if (intersection) {
        marker.position.copy(intersection)
      }
    }

    marker.visible = intersection !== undefined
  })

  return {
    dispose,
  }
}

