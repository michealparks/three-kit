import type * as THREE from 'three'
import { pane, addFolder } from './pane'
import { addTransformInputs, addForwardHelperInput } from './pane/inputs'

export const meshFolder = addFolder(pane, 'meshes', 2)

const meshes = new Set<THREE.Mesh>()

export const register = (mesh: THREE.Mesh) => {
  const isInstanced = 'isInstancedMesh' in mesh

  meshes.add(mesh)
  const folder = addFolder(meshFolder, `#${mesh.id} ${mesh.name || '[unnamed]'}${isInstanced ? ' (instanced)' : ''}`)
  addTransformInputs(folder, mesh)
  addForwardHelperInput(folder, mesh)
}

export const deregister = (mesh: THREE.Mesh) => {
  meshes.delete(mesh)
}
