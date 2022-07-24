import * as THREE from 'three'

interface Fog {
  color: THREE.ColorRepresentation
  near: number
  far: number
}

export const createScene = (background?: THREE.ColorRepresentation, fog?: Fog) => {
  const scene = new THREE.Scene()

  if (background !== undefined) {
    scene.background = new THREE.Color(background);
  }

  if (fog !== undefined) {
    scene.fog = new THREE.Fog(fog.color, fog.near, fog.far)
  }
  
  return scene
}
