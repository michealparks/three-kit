
import * as THREE from 'three'
import { MeshLineGeometry } from './geometry'
import { MeshLineMaterial } from './material'

type Settings = {
  width?: number
  length: number
  decay: number
  /**
   * Wether to use the target's world or local positions
   */
  local: boolean
  // Min distance between previous and current points
  stride: number
  // Number of frames to wait before next calculation
  interval: number
}

type TrailProps = {
  color?: THREE.ColorRepresentation
  attenuation?: (width: number) => number
  target: THREE.Object3D
} & Partial<Settings>

const shiftLeft = (collection: Float32Array, steps = 1): Float32Array => {
  collection.set(collection.subarray(steps))
  collection.fill(-Infinity, -steps)
  return collection
}

export class Trail extends THREE.Mesh {
  worldPosition = new THREE.Vector3()
  prevPosition = new THREE.Vector3()
  frameCount = 0
  decay = 1
  length = 20
  width = 0.5
  stride = 0
  interval = 1
  local = false

  points: Float32Array
  target: THREE.Object3D

  constructor (props: TrailProps) {
    const { color = 'hotpink', target } = props

    const geometry = new MeshLineGeometry()
    const material = new MeshLineMaterial({
      color,
      lineWidth: 0.1,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
      sizeAttenuation: 1,
    })

    super(geometry, material)

    material.lineWidth = 0.1 * this.width

    this.target = target
    this.points = Float32Array.from({
      length: this.length * 10 * 3,
    }, (_, i) => target.position.getComponent(i % 3))
  }

  update () {
    if (this.frameCount === 0) {
      let newPosition: THREE.Vector3

      if (this.local) {
        newPosition = this.target.position
      } else {
        this.target.getWorldPosition(this.worldPosition)
        newPosition = this.worldPosition
      }

      for (let i = 0; i < this.decay; i += 1) {
        if (newPosition.distanceTo(this.prevPosition) < this.stride) {
          continue
        }

        shiftLeft(this.points, 3)
        this.points.set(newPosition.toArray(), this.points.length - 3)
      }
      this.prevPosition.copy(newPosition)

      this.geometry.points = this.points
    }

    this.frameCount += 1
    this.frameCount %= this.interval
  }

  setAttenuation (callback) {
    this.geometry.widthCallback = callback
  }
}
