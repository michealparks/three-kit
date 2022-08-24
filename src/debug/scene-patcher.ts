import * as lights from './lights'
import * as meshes from './meshes'
import * as objects from './objects'
import { scene } from '../lib/scene'

const add = scene.add.bind(scene)
const remove = scene.remove.bind(scene)

scene.add = (...args) => {
  const [object] = args

  if ('isLight' in object) {
    lights.register(object as THREE.Light)
  } else if ('isMesh' in object) {
    meshes.register(object as THREE.Mesh)
  } else if ('isObject3D' in object) {
    objects.register(object)
  }

  return add(...args)
}

scene.remove = (...args) => {
  const [object] = args

  if ('isLight' in object) {
    lights.deregister(object as THREE.Light)
  } else if ('isMesh' in object) {
    meshes.register(object as THREE.Mesh)
  } else if ('isObject3D' in object) {
    objects.register(object)
  }

  return remove(...args)
}
