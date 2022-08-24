import * as THREE from 'three'
import { Panes, addFolder, state } from '.'
import { update } from '../../lib'

const vec3 = new THREE.Vector3()
const scale = new THREE.Vector3()
const quat = new THREE.Quaternion()
const mat4 = new THREE.Matrix4()

const quatSettings = {
  expanded: true,
  picker: 'inline',
  view: 'rotation',
}

export const addTransformInputs = (pane: Panes, object3D: THREE.Object3D) => {
  const { quaternion } = object3D

  const params = {
    quaternion: new THREE.Quaternion(),
  }

  const quaternionChange = () => {
    if (state.controlling) {
      quaternion.copy(params.quaternion)
    }
  }

  const posInput = pane.addInput(object3D, 'position', { step: 0.1 })
  const rotInput = pane.addInput(params, 'quaternion', quatSettings)
    .on('change', quaternionChange)

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

    const imeshIndex = imeshFolder.addInput(imeshParams, 'index', {
      max: imesh.count - 1,
      min: 0,
      step: 1,
    })
    const imeshPos = imeshFolder.addInput(imeshParams, 'position')
    const imeshRot = imeshFolder.addInput(imeshParams, 'quaternion', quatSettings)

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

    imeshIndex.on('change', instanceIndexChange)
    imeshPos.on('change', instanceChange)
    imeshRot.on('change', instanceChange)

    update(() => {
      if (imeshFolder.expanded && !state.controlling) {
        imeshParams.quaternion.copy(quaternion)
        imeshPos.refresh()
        imeshRot.refresh()
      }
    })
  }
}

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
