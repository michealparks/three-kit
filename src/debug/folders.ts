import type GUI from 'lil-gui'

const tryParse = (str: string | null) => {
  try {
    return JSON.parse(str || '{}')
  } catch {
    return {}
  }
}

const closed = tryParse(localStorage.getItem('gui.folders'))

export const addFolder = (ui: GUI, name: string) => {
  const folder = ui.addFolder(name)
  if (closed[name] === true || closed[name] === undefined) {
    folder.close()
  }
  return folder
}

export const addTransformFolder = (ui: GUI, object3D: THREE.Object3D) => {
  const folder = addFolder(ui, 'transform')
  folder.close()

  const position = {
    x: object3D.position.x,
    y: object3D.position.y,
    z: object3D.position.z,
  }

  const rotation = {
    x: object3D.quaternion.x,
    y: object3D.quaternion.y, 
    z: object3D.quaternion.z,
    w: object3D.quaternion.w,
  }

  const positionFolder = addFolder(folder, 'position')
  positionFolder.add(position, 'x').onChange((n: number) => object3D.position.x = n)
  positionFolder.add(position, 'y').onChange((n: number) => object3D.position.y = n)
  positionFolder.add(position, 'z').onChange((n: number) => object3D.position.z = n)

  const rotationFolder = addFolder(folder, 'position')
  rotationFolder.add(rotation, 'x').onChange((n: number) => object3D.quaternion.x = n)
  rotationFolder.add(rotation, 'y').onChange((n: number) => object3D.quaternion.y = n)
  rotationFolder.add(rotation, 'z').onChange((n: number) => object3D.quaternion.z = n)
  rotationFolder.add(rotation, 'w').onChange((n: number) => object3D.quaternion.w = n)
}
