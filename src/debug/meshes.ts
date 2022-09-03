import * as THREE from 'three'
import { addFolder, deleteFolder, pane } from './pane'
import { addForwardHelperInput } from './inputs/helper-forward'
import { addMaterialInputs } from './inputs/material'
import { addTransformInputs } from './inputs/transform'

export const meshFolder = addFolder(pane, 'meshes', 2)

type Disposer = () => void

const disposers = new WeakMap<THREE.Mesh, Disposer>()

export const register = (mesh: THREE.Mesh) => {
  const isInstanced = mesh instanceof THREE.InstancedMesh
  const instancedFlag = isInstanced ? ' (instanced)' : ''
  const name = `#${mesh.id} ${mesh.name || '[unnamed]'}${instancedFlag}`
  const folder = addFolder(meshFolder, name)
  const disposeTransformInputs = addTransformInputs(folder, mesh)
  const disposeMaterialInputs = addMaterialInputs(folder, mesh)
  const disposeForwardHelper = addForwardHelperInput(folder, mesh)

  disposers.set(mesh, () => {
    disposeTransformInputs()
    disposeMaterialInputs()
    disposeForwardHelper()
    deleteFolder(folder)
  })
}

export const deregister = (mesh: THREE.Mesh) => {
  disposers.get(mesh)!()
  disposers.delete(mesh)
}
