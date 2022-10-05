import './main.css'
import * as THREE from 'three'
import Debug from 'three-debug'
import { camera, cameraShake, run, update, lights, scene, meshUi, xr, composer, renderer } from '../src/main'

const parameters = {
  scale: 1,
  autoRotate: true,
  rotate: {
    x: 0.01,
    y: 0.01,
  },
}

{
  const light = lights.createAmbient(undefined, 0.2)
  light.position.set(1, 1, 1).normalize()
  scene.add(light)
}

// {
//   const light = lights.createDirectional(undefined, 0.5)
//   light.castShadow = true
//   light.position.set(3, 3, 3)
//   scene.add(light)
// }

// {
//   const light = lights.createRectArea(undefined, 1, 1, 3)
//   light.position.set(0, 5, 1)
//   light.rotation.set(-Math.PI / 4, 0, 0)
//   scene.add(light)
// }

{
  const light = lights.createVolumetricSpot()
  light.name = 'Volumetric Spot'
  light.castShadow = true
  light.shadow.normalBias = -0.1
  light.shadow.camera.near = 2
  light.shadow.camera.far = 10
  light.angle = 1.09
  light.penumbra = 0.37
  light.position.set(0, 3, 0)
  scene.add(light)
}

{
  const planeGeo = new THREE.PlaneGeometry(10, 10)
  const planeMat = new THREE.MeshStandardMaterial()
  planeMat.flatShading = true

  const floor = new THREE.Mesh(planeGeo, planeMat)
  floor.name = 'Floor'
  floor.receiveShadow = true
  scene.add(floor)
  floor.rotation.set(-Math.PI / 2, 0, 0)

  if (import.meta.env.THREE_XR === 'true') {
    xr.enableTeleport(floor)
  }
}

const mat4 = new THREE.Matrix4()
const size = 0.5
const count = 5
const boxGeo = new THREE.BoxGeometry(size, size, size)
const boxMat = new THREE.MeshStandardMaterial({ color: 'hotpink' })
boxMat.flatShading = true

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
const material = new THREE.MeshPhysicalMaterial({ color: 0x00ff00 })
material.side = THREE.DoubleSide
material.transparent = true
material.flatShading = true
material.opacity = 0.5
material.roughness = 0.1
material.metalness = 0.01
material.reflectivity = 1
material.clearcoat = 1
material.clearcoatRoughness = 0

const mesh = new THREE.Mesh(geometry, material)
mesh.name = 'Icosahedron'
mesh.position.set(0, 1, -2)
mesh.castShadow = true
scene.add(mesh)

camera.position.set(0, 2, 3)

let ry = 0

const pos = new THREE.Vector3()

const block = meshUi.createBlock()
const text = meshUi.createText('hello world!')
block.add(text)
block.name = 'Block'
block.position.y = 1.60
scene.add(block)

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

// cameraShake.enable()

/**
 * This is how debugging should be imported to allow tree-shaking
 */
 if (import.meta.env.THREE_DEBUG === 'true') {

  const debug = new Debug(THREE, scene, camera, renderer, composer)
  
  const pane = debug.addPane('game')

  pane.addInput(parameters, 'scale').on('change', () => {
    mesh.scale.setScalar(parameters.scale)
  })

  pane.addInput(parameters, 'autoRotate')
  pane.addInput(parameters, 'rotate')
}
