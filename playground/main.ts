import './main.css'
import * as THREE from 'three'
import { threekit } from '../src/main'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!

const { debug, xr, scene, camera, setAnimationLoop } = threekit({
  canvas,
  antialias: false,
  xr: true,
  shadowMap: false,
  post: false,
  debug: true,
})

canvas.addEventListener('click', () => {
  xr?.requestSession()
})

{
  const light = new THREE.DirectionalLight( 0xefc070, 4.0 )
  light.position.set( 1, 1, 1 ).normalize()
  scene.add( light )
}

{
  const light = new THREE.AmbientLight(0xfff5b6, 0.5)
  light.position.set( 1, 1, 1 ).normalize()
  scene.add( light )
}

const geometry = new THREE.IcosahedronGeometry( )
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
const mesh = new THREE.Mesh( geometry, material )
mesh.position.set(0, 1.8, -3)
scene.add( mesh )

camera.position.set(0, 1.8, 3)

const parameters = {
  scale: 1,
  rotateX: 0.01,
  rotateY: 0.01
};

debug?.ui.add(parameters, 'scale', 0.1, 5 ).onChange(() => {
  mesh.scale.setScalar(parameters.scale)
})

debug?.ui.add(parameters, 'rotateX', 0.001, 0.1 )
debug?.ui.add(parameters, 'rotateY', 0.001, 0.1 )

setAnimationLoop((elapsed: number) => {
  mesh.rotation.x += parameters.rotateX
  mesh.rotation.y += parameters.rotateY
})
