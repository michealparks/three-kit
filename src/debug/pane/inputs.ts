import * as THREE from 'three'
import { addFolder, Panes } from '.'
import { state } from '.'
import { update } from '../../lib'

const vec3 = new THREE.Vector3()
const scale = new THREE.Vector3()
const quat = new THREE.Quaternion()
const mat4 = new THREE.Matrix4()

const quatSettings = {
  view: 'rotation',
  picker: 'inline',
  expanded: true
}

export const addTransformInputs = (pane: Panes, object3D: THREE.Object3D) => {
  const { position, quaternion } = object3D
  const params = {
    position,
    quaternion: new THREE.Quaternion()
  }

  const quaternionChange = () => {
    if (state.controlling) {
      quaternion.copy(params.quaternion)
    }

    if (object3D instanceof THREE.Camera) {
      const camera = object3D as THREE.Camera
      camera.updateMatrixWorld()
    }
  }

  const posInput = pane.addInput(params, 'position', {
    step: 0.1
  })

  const rotInput = pane.addInput(params, 'quaternion', quatSettings).on('change', quaternionChange)

  update(() => {
    if (pane.expanded && !state.controlling) {
      params.quaternion.copy(quaternion)

      rotInput.refresh()
      posInput.refresh()
    }
  })

  if ('isInstancedMesh' in object3D) {
    const imesh = object3D as THREE.InstancedMesh
    const imeshFolder = addFolder(pane, 'instances')

    const imeshParams = {
      index: 0,
      position: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
    }

    const instanceIndexChange = () => {
      imesh.getMatrixAt(imeshParams.index, mat4)
      mat4.decompose(vec3, quat, scale)
      imeshParams.position.copy(vec3)
      imeshParams.quaternion.copy(quat)
      imeshPos.refresh()
      imeshRot.refresh()
    }

    const instanceChange = () => {
      quat.copy(imeshParams.quaternion)
      vec3.copy(imeshParams.position)
      mat4.makeRotationFromQuaternion(quat)
      mat4.setPosition(vec3)
      imesh.setMatrixAt(imeshParams.index, mat4)
      imesh.instanceMatrix.needsUpdate = true
    }
  
    imeshFolder.addInput(imeshParams, 'index', { step: 1, min: 0, max: imesh.count - 1 }).on('change', instanceIndexChange)
    const imeshPos = imeshFolder.addInput(imeshParams, 'position').on('change', instanceChange)
    const imeshRot = imeshFolder.addInput(imeshParams, 'quaternion', quatSettings).on('change', instanceChange)

    update(() => {
      imeshParams.quaternion.copy(quaternion)
      if (imeshFolder.expanded && !state.controlling) {
        imeshPos.refresh()
        imeshRot.refresh()
      }
    })
  }
}

export const addForwardHelperInput = (pane: Panes, object3D: THREE.Object3D) => {
  const helper = new THREE.ArrowHelper()
  helper.setLength(1.5)

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
