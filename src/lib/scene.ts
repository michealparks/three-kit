import * as THREE from 'three'

export const scene = new THREE.Scene()

const disposeMaterial = (material: THREE.Material) => {
  material.dispose()

  const map = (material as THREE.MeshStandardMaterial).map as (
    THREE.Texture | undefined
  )

  if (map !== undefined) {
    map.dispose()
  }
}

export const disposeScene = (): void => {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      const { geometry, material } = object as THREE.Mesh
      geometry.dispose()

      if (Array.isArray(material)) {
        for (const item of material) {
          disposeMaterial(item)
        }
      } else {
        disposeMaterial(material)
      }
    }
  })

  scene.clear()
}
