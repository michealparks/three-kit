import type * as THREE from 'three'
import { pane, addFolder } from './pane'
import { addTransformInputs, addForwardHelperInput } from './pane/inputs'

export const objectFolder = addFolder(pane, 'objects', 3)

const objects = new Set<THREE.Object3D>()

export const register = (object: THREE.Object3D) => {
  objects.add(object)
  const folder = addFolder(objectFolder, `#${object.id} ${object.name || '[unnamed]'}`)
  addTransformInputs(folder, object)
  addForwardHelperInput(folder, object)
}

export const deregister = (object: THREE.Object3D) => {
  objects.delete(object)
}
