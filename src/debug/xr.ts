import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory'
import * as THREE from 'three'
import { renderer, scene } from '../lib'

export const createControllerModels = () => {
  const controllerModelFactory = new XRControllerModelFactory()

  const controllerGrip1 = renderer.xr.getControllerGrip(0)
  controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1))
  scene.add(controllerGrip1)

  const controllerGrip2 = renderer.xr.getControllerGrip(1)
  controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2))
  scene.add(controllerGrip2)

  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, - 5)
  ])

  const controller1 = renderer.xr.getController(0)
  controller1.add(new THREE.Line(geometry))
  scene.add(controller1)

  const controller2 = renderer.xr.getController(1)
  controller2.add(new THREE.Line(geometry))
  scene.add(controller2)
}
