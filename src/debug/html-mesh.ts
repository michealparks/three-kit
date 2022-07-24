import { InteractiveGroup } from 'three/examples/jsm/interactive/InteractiveGroup'
import { HTMLMesh } from 'three/examples/jsm/interactive/HTMLMesh'

export const createHTMLMesh = (element: HTMLElement, renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => {
  const group = new InteractiveGroup(renderer, camera)
  scene.add(group)

  const mesh = new HTMLMesh(element)
  mesh.scale.setScalar(2)
  group.add(mesh)

  return mesh
}
