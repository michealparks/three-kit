import './main.css'
import * as THREE from 'three'
import { camera, run, update, lights, scene } from '../src/main'

const parameters = {
  scale: 1,
  autoRotate: true,
  rotate: {
    x: 0.01,
    y: 0.01,
  },
}

/**
 * This is how debugging should be imported to allow tree-shaking
 */
if (import.meta.env.THREE_DEBUG === 'true') {
  const debug = await import('../src/debug')
  const pane = debug.addPane('game')

  pane.addInput(parameters, 'scale').on('change', () => {
    mesh.scale.setScalar(parameters.scale)
  })

  pane.addInput(parameters, 'autoRotate')
  pane.addInput(parameters, 'rotate')
}

{
  const light = lights.createAmbient(undefined, 0.2)
  light.position.set(1, 1, 1).normalize()
  scene.add(light)
}

{
  const light = lights.createDirectional(undefined, 0.5)
  light.castShadow = true
  light.position.set(3, 3, 3)
  scene.add(light)
}

{
  const light = lights.createRectArea(undefined, 1, 1, 3)
  light.position.set(0, 5, 1)
  light.rotation.set(-Math.PI / 4, 0, 0)
  scene.add(light)
}

{
  const light = lights.createSpot()
  light.castShadow = true
  light.position.set(0, 5, 0)
  scene.add(light)
}

{
  const planeGeo = new THREE.PlaneGeometry(10, 10)
  const planeMat = new THREE.MeshStandardMaterial()
  const plane = new THREE.Mesh(planeGeo, planeMat)
  plane.name = 'Floor'
  plane.receiveShadow = true
  scene.add(plane)
  plane.rotation.set(-Math.PI / 2, 0, 0)
}

const mat4 = new THREE.Matrix4()
const size = 0.5
const count = 5
const boxGeo = new THREE.BoxGeometry(size, size, size)
const boxMat = new THREE.MeshStandardMaterial({ color: 'hotpink' })
const boxes = new THREE.InstancedMesh(boxGeo, boxMat, count)
boxes.name = 'Boxes'
boxes.castShadow = true
boxes.receiveShadow = true
scene.add(boxes)
boxes.position.set(-3, 0, 0)

for (let i = 0; i < count; i += 1) {
  mat4.setPosition(i + 0.5, size / 2, 0)
  boxes.setMatrixAt(i, mat4)
}

const geometry = new THREE.IcosahedronGeometry()
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
material.roughness = 0.5
material.metalness = 0.5
const mesh = new THREE.Mesh(geometry, material)
mesh.name = 'Icosahedron'
mesh.position.set(0, 1, -2)
mesh.castShadow = true
scene.add(mesh)

camera.position.set(0, 2, 3)

let ry = 0

const pos = new THREE.Vector3()

update((time: number) => {
  ry += 0.1

  boxes.getMatrixAt(2, mat4)
  pos.setFromMatrixPosition(mat4)
  
  mat4.makeRotationY(ry)
  pos.z = (Math.sin(time / 200) / 2)
  mat4.setPosition(pos)
  
  boxes.setMatrixAt(2, mat4)
  boxes.instanceMatrix.needsUpdate = true

  if (parameters.autoRotate) {
    mesh.position.y = (Math.sin(time / 1000) / 2) + 2
    mesh.rotation.x += parameters.rotate.x
    mesh.rotation.y += parameters.rotate.y
  }
})

run()
