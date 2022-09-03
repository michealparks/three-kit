import * as THREE from 'three'
import { removeUpdate, update } from './update'
import {
  XRControllerModelFactory
} from 'three/examples/jsm/webxr/XRControllerModelFactory'
import { raycaster } from './raycaster'
import { renderer } from './renderer'
import { scene } from './scene'


const offsetPosition = {
  w: 1,
  x: 0,
  y: 0,
  z: 0,
}

const offsetRotation = new THREE.Quaternion()
const m4 = new THREE.Matrix4()
const objects: THREE.Object3D[] = []

const raylines: THREE.Line[] = []
const controllers: THREE.XRTargetRaySpace[] = []
const grips: THREE.XRGripSpace[] = []
const controllerModelFactory = new XRControllerModelFactory()

let enabled = false
let baseReferenceSpace: XRReferenceSpace | null
let selecting = -1
let intersection: THREE.Vector3 | undefined

renderer.xr.addEventListener('sessionstart', () => {
  baseReferenceSpace = renderer.xr.getReferenceSpace()
})

const fragmentShader = `
uniform float time;
varying vec2 vUv;
void main(){
  float sinx = sin(time) / 8. + 0.3;
  float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - sinx));
  gl_FragColor = vec4(strength);
}`

const vertexShader = `
varying vec2 vUv;
void main(){
  vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const markerGeometry = new THREE.PlaneGeometry(0.5, 0.5).rotateX(-Math.PI / 2)
const markerMaterial = new THREE.ShaderMaterial({
  fragmentShader,
  uniforms: {
    time: { value: 0.0 },
  },
  vertexShader,
})
markerMaterial.polygonOffset = true
markerMaterial.polygonOffsetFactor = -1.0
markerMaterial.transparent = true

const marker = new THREE.Mesh(markerGeometry, markerMaterial)
marker.name = 'Teleport Marker'
marker.visible = false

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
    offsetPosition.x = -intersection.x
    offsetPosition.y = -intersection.y
    offsetPosition.z = -intersection.z

    const transform = new XRRigidTransform(offsetPosition, offsetRotation)
    const teleportSpaceOffset = baseReferenceSpace!.getOffsetReferenceSpace(transform)

    renderer.xr.setReferenceSpace(teleportSpaceOffset)
  }
}

for (let i = 0; i < 2; i += 1) {
  const lineGeometry = new THREE.BufferGeometry()
  const lineMaterial = new THREE.LineBasicMaterial({
    blending: THREE.AdditiveBlending,
    transparent: true,
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
  controllers.push(controller)

  const controllerGrip = renderer.xr.getControllerGrip(i)
  controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip))
  controllerGrip.name = `XR Controller Grip ${i + 1}`
  grips.push(controllerGrip)
}

const handleUpdate = (time: number) => {
  intersection = undefined

  if (selecting > -1) {
    const activeController = controllers[selecting]
    m4.identity().extractRotation(activeController.matrixWorld)
    raycaster.ray.origin.setFromMatrixPosition(activeController.matrixWorld)
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(m4)
    const intersects = raycaster.intersectObjects(objects, false)

    if (intersects.length > 0) {
      intersection = intersects[0].point
    }

    if (intersection) {
      marker.position.copy(intersection)
    }

    markerMaterial.uniforms.time.value = time / 200
  }

  marker.visible = intersection !== undefined
}

export const enableTeleport = (navMesh: THREE.Object3D) => {
  if (enabled) {
    return
  }

  objects.push(navMesh)
  scene.add(marker)
  scene.add(controllers[0])
  scene.add(controllers[1])
  scene.add(grips[0])
  scene.add(grips[1])

  update(handleUpdate)

  enabled = true
}

export const disableTeleport = () => {
  objects.pop()
  scene.remove(marker)
  scene.remove(controllers[0])
  scene.remove(controllers[1])
  scene.remove(grips[0])
  scene.remove(grips[1])

  removeUpdate(handleUpdate)

  enabled = false
}
