import './main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { renderer, camera, setAnimationLoop, xr, lights, scene } from '../src/main'
import * as debug from '../src/debug'

console.log(renderer.domElement)
const debugControls = new OrbitControls(camera, renderer.domElement)

renderer.domElement.addEventListener('click', () => {
  xr.requestSession()
})

{
  const supportState = await xr.requestXrSessionSupport()!
  const supportMessage = xr.xrSupportStateMessage[supportState]
  console.log('support:', supportMessage)
}

{
  const light = lights.createAmbient()
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
  const light = lights.createSpot(undefined, 5)
  light.castShadow = true
  light.position.set(0, 5, 0)
  scene.add(light)
}

const geometry = new THREE.IcosahedronGeometry()
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
const mesh = new THREE.Mesh(geometry, material)
mesh.name = 'Icosahedron'
mesh.position.set(0, 1, -3)
mesh.castShadow = true
scene.add(mesh)

camera.position.set(0, 2, 3)

{
  const planeGeo = new THREE.PlaneGeometry(10, 10)
  const planeMat = new THREE.MeshStandardMaterial()
  const plane = new THREE.Mesh(planeGeo, planeMat)
  plane.receiveShadow = true
  scene.add(plane)
  plane.rotation.set(-Math.PI / 2, 0, 0)
}

const parameters = {
  scale: 1,
  autoRotate: true,
  rotate: {
    x: 0.01,
    y: 0.01,
  },
}

debug.ui.addInput(parameters, 'scale').on('change', () => {
  mesh.scale.setScalar(parameters.scale)
})

debug.ui.addInput(parameters, 'autoRotate')
debug.ui.addInput(parameters, 'rotate')

setAnimationLoop((elapsed: number) => {
  if (parameters.autoRotate) {
    mesh.rotation.x += parameters.rotate.x
    mesh.rotation.y += parameters.rotate.y
  }
  debug.update()
  debugControls.update()
})
