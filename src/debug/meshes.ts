import type * as THREE from 'three'
import { addFolder, pane } from './pane'
import { addForwardHelperInput, addTransformInputs } from './pane/inputs'

export const meshFolder = addFolder(pane, 'meshes', 2)

const meshes = new Set<THREE.Mesh>()

export const register = (mesh: THREE.Mesh) => {
  meshes.add(mesh)

  const isInstanced = 'isInstancedMesh' in mesh
  const instancedFlag = isInstanced ? ' (instanced)' : ''
  const name = `#${mesh.id} ${mesh.name || '[unnamed]'}${instancedFlag}`
  const folder = addFolder(meshFolder, name)
  addTransformInputs(folder, mesh)
  addForwardHelperInput(folder, mesh)
}

export const deregister = (mesh: THREE.Mesh) => {
  meshes.delete(mesh)
}
