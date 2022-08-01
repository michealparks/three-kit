import * as THREE from 'three'
import { addFolder, meshFolder, addTransformInputs } from './pane'

const meshes = new Set<THREE.Mesh>()

export const register = (mesh: THREE.Mesh) => {
  meshes.add(mesh)
  const folder = addFolder(meshFolder, `#${mesh.id} ${mesh.name || 'no name'}`)
  addTransformInputs(folder, mesh)
}

export const deregister = (mesh: THREE.Mesh) => {
  meshes.delete(mesh)
}
