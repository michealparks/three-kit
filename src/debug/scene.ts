import { scene } from '../lib/scene'
import * as lights from './lights'
import * as meshes from './meshes'

const add = scene.add.bind(scene)
const remove = scene.remove.bind(scene)

scene.add = (...args) => {
  const [object] = args

  if ('isLight' in object) {
    lights.register(object as THREE.Light)
  } else if ('isMesh' in object) {
    meshes.register(object as THREE.Mesh)
  }

  return add(...args)
}

scene.remove = (...args) => {
  const [object] = args

  if ('isLight' in object) {
    lights.deregister(object as THREE.Light)
  } else if ('isMesh' in object) {
    meshes.register(object as THREE.Mesh)
  }

  return remove(...args)
}

export { scene }
