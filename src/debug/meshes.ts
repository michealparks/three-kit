import * as THREE from 'three'
import type GUI from 'lil-gui'
import * as folders from './folders'

const meshes = new Set<THREE.Mesh>()

export const register = (ui: GUI, mesh: THREE.Mesh) => {
  meshes.add(mesh)
  const folder = folders.addFolder(ui, `#${mesh.id} ${mesh.name || 'no name'}`)
  folders.addTransformFolder(folder, mesh)
}

export const deregister = (mesh: THREE.Mesh) => {
  meshes.delete(mesh)
}
