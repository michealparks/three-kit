import './main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { renderer, camera, setAnimationLoop, xr, lights, scene, controls } from '../src/main'
import * as debug from '../src/debug'

const debugControls = new OrbitControls(camera, renderer.domElement)

renderer.domElement.addEventListener('click', () => {
  xr.requestSession()
})

const _xrSupportLog = async () => {
  const supportState = await xr.requestXrSessionSupport()!
  const supportMessage = xr.xrSupportStateMessage[supportState]
  console.log('support:', supportMessage)
}

_xrSupportLog()

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

const geometry = new THREE.IcosahedronGeometry()
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
const mesh = new THREE.Mesh(geometry, material)
mesh.name = 'Icosahedron'
mesh.position.set(0, 1, -2)
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

const pane = debug.addPane('game')

pane.addInput(parameters, 'scale').on('change', () => {
  mesh.scale.setScalar(parameters.scale)
})

pane.addInput(parameters, 'autoRotate')
pane.addInput(parameters, 'rotate')

setAnimationLoop((elapsed: number) => {
  if (parameters.autoRotate) {
    mesh.rotation.x += parameters.rotate.x
    mesh.rotation.y += parameters.rotate.y
  }
  debug.update()
  debugControls.update()

  controls.update()
})
