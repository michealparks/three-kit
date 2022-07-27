import './main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { threekit, xr, createDebugTools, lights, scene } from '../src/main'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!

const initParams = {
  canvas,
  antialias: false,
  xr: true,
  shadowMap: true,
  post: true,
}

const {
  renderer,
  camera,
  setAnimationLoop
} = threekit(initParams)

const debugControls = new OrbitControls(camera, canvas)

const debug = createDebugTools(initParams, renderer, scene, camera)

canvas.addEventListener('click', () => {
  xr.requestSession(renderer)
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

{
  const light = lights.createRectArea(undefined, 1, 1, 3)
  light.position.set(0, 5, 1)
  light.rotation.set(-Math.PI / 4, 0, 0)
  scene.add(light)
}

{
  const light = lights.createSpot(undefined, 5)
  light.castShadow = true
  light.position.set(0, 5, 0)
  scene.add(light)
}

const geometry = new THREE.IcosahedronGeometry()
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
const mesh = new THREE.Mesh(geometry, material)
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
  rotateX: 0.01,
  rotateY: 0.01
}

debug.ui.add(parameters, 'scale', 0.1, 5).onChange(() => {
  mesh.scale.setScalar(parameters.scale)
})

debug.ui.add(parameters, 'rotateX', 0.001, 0.1)
debug.ui.add(parameters, 'rotateY', 0.001, 0.1)

setAnimationLoop((elapsed: number) => {
  mesh.rotation.x += parameters.rotateX
  mesh.rotation.y += parameters.rotateY
  debug.update()
  debugControls.update()
})
