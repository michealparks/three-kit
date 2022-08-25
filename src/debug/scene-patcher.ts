import * as THREE from 'three'
import * as lights from './lights'
import * as meshes from './meshes'
import * as objects from './objects'
import { scene } from '../lib/scene'

const add = scene.add.bind(scene)
const remove = scene.remove.bind(scene)

scene.add = (...args) => {
  const [object] = args

  if (object instanceof THREE.Light) {
    lights.register(object)
  } else if (object instanceof THREE.Mesh) {
    meshes.register(object as THREE.Mesh)
  } else if (object instanceof THREE.Object3D) {
    objects.register(object)
  } else {
    // @TODO Surface uncaught objects
  }

  return add(...args)
}

scene.remove = (...args) => {
  const [object] = args

  if (object instanceof THREE.Light) {
    lights.deregister(object)
  } else if (object instanceof THREE.Mesh) {
    meshes.deregister(object)
  } else if (object instanceof THREE.Object3D) {
    objects.deregister(object)
  }

  return remove(...args)
}
