import * as THREE from 'three'

export const scene = new THREE.Scene()

export const clearScene = (): void => {
  const toDelete = new Set<THREE.Object3D>()

  scene.traverse((object) => {
    toDelete.add(object)
  })

  for (const object of toDelete) {
    scene.remove(object)

    if (object instanceof THREE.Mesh) {
      object.geometry.dispose()

      if (Array.isArray(object.material)) {
        for (const material of object.material) {
          material.dispose()
        }
      } else {
        object.material.dispose()
      }
    }
  }
}
