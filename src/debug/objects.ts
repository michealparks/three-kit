import type * as THREE from 'three'
import { addFolder, deleteFolder, pane } from './pane'
import { addForwardHelperInput } from './inputs/helper-forward'
import { addTransformInputs } from './inputs/transform'

export const objectFolder = addFolder(pane, 'objects', 3)

type Disposer = () => void

const disposers = new WeakMap<THREE.Object3D, Disposer>()

export const register = (object: THREE.Object3D) => {
  const name = `#${object.id} ${object.name || '[unnamed]'}`
  const folder = addFolder(objectFolder, name)
  const disposeTransformInputs = addTransformInputs(folder, object)
  const disposeForwardHelper = addForwardHelperInput(folder, object)

  disposers.set(object, () => {
    disposeTransformInputs()
    disposeForwardHelper()
    deleteFolder(folder)
  })
}

export const deregister = (object: THREE.Object3D) => {
  disposers.get(object)!()
  disposers.delete(object)
}
  