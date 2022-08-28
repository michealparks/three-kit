import * as THREE from 'three'
import type { Panes } from '../pane'

export const addForwardHelperInput = (pane: Panes, object3D: THREE.Object3D) => {
  const helper = new THREE.ArrowHelper()
  helper.setLength(1)

  const params = {
    forwardHelper: false,
  }

  pane.addInput(params, 'forwardHelper').on('change', () => {
    if (params.forwardHelper) {
      object3D.add(helper)
    } else {
      object3D.remove(helper)
    }
  })
}
