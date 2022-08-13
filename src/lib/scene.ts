import * as THREE from 'three'

export const scene = new THREE.Scene()

export const clearScene = (scene: THREE.Scene): void => {
  const toDelete = new Set<THREE.Object3D>()

  scene.traverse((object) => {
    toDelete.add(object)
  })

  for (const object of toDelete) {
    scene.remove(object)

    if (object instanceof THREE.Mesh) {
      object.geometry.dispose()

      if (Array.isArray(object.material)) {
        for (const m of object.material) {
          m.dispose()
        }
      } else {
        object.material.dispose()
      }
    }
  }
}
