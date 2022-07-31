import * as THREE from 'three'
import * as ui from './pane'

const meshes = new Set<THREE.Mesh>()

export const register = (pane: ui.Panes, mesh: THREE.Mesh) => {
  meshes.add(mesh)
  const folder = ui.addFolder(pane, `#${mesh.id} ${mesh.name || 'no name'}`)
  ui.addTransformInputs(folder, mesh)
}

export const deregister = (mesh: THREE.Mesh) => {
  meshes.delete(mesh)
}
