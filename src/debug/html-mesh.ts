import { InteractiveGroup } from 'three/examples/jsm/interactive/InteractiveGroup'
import { HTMLMesh } from 'three/examples/jsm/interactive/HTMLMesh'
import type UI from 'lil-gui'

export const createHTMLMesh = (ui: UI, renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => {
  const group = new InteractiveGroup( renderer, camera )
  scene.add( group )

  const mesh = new HTMLMesh(ui.domElement)
  mesh.position.set(-0.75, 1.5, -0.5)
  mesh.rotation.set(0, Math.PI / 4, 0)
  mesh.scale.setScalar(2)
  group.add(mesh)

  return mesh
}
