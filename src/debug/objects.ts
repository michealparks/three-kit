import type * as THREE from 'three'
import { addFolder, pane } from './pane'
import { addForwardHelperInput } from './inputs/helper-forward'
import { addTransformInputs } from './inputs/transform'

export const objectFolder = addFolder(pane, 'objects', 3)

const objects = new Set<THREE.Object3D>()

export const register = (object: THREE.Object3D) => {
  objects.add(object)

  const name = `#${object.id} ${object.name || '[unnamed]'}`
  const folder = addFolder(objectFolder, name)
  addTransformInputs(folder, object)
  addForwardHelperInput(folder, object)
}

export const deregister = (object: THREE.Object3D) => {
  objects.delete(object)
}
