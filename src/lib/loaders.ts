import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

THREE.Cache.enabled = true

export const manager = new THREE.LoadingManager()

export const audioLoader = new THREE.AudioLoader(manager)
export const fileLoader = new THREE.FileLoader(manager)
export const gltfLoader = new GLTFLoader(manager)
export const textureLoader = new THREE.TextureLoader(manager)

audioLoader.setPath(kit__DIR_AUDIO)
fileLoader.setPath(kit__DIR_FILE)
gltfLoader.setPath(kit__DIR_GLB)
textureLoader.setPath(kit__DIR_TEXTURES)

export const loadJSON = async <Type = unknown>(file: string): Promise<Type> => {
  const response = await fileLoader.loadAsync(file) as string
  return JSON.parse(response)
}

export const loadFile = (file: string) => {
  return fileLoader.loadAsync(file)
}

export const loadTexture = (file: string) => {
  return textureLoader.loadAsync(file)
}

export const loadAudio = (file: string) => {
  return audioLoader.loadAsync(file)
}

export const loadGLTF = (file: string) => {
  return gltfLoader.loadAsync(file)
}

const toJSON = (result: Response) => {
  return result.json()
}

export const loadAseprite = async (file: string) => {
  const url = `${kit__DIR_TEXTURES}/${file.replace('sprite', 'json')}`
  const [data, tex] = await Promise.all([
    fetch(url).then(toJSON),
    textureLoader.loadAsync(file.replace('sprite', 'png')),
  ])

  const sprite = {
    frames: data.frames,
    meta: data.meta,
    texture: tex,
  }

  return sprite
}

const load = (file: string) => {
  switch (file.split('.').pop()) {
  case 'glb':
    return loadGLTF(file)
  case 'png':
  case 'jpg':
    return loadTexture(file)
  case 'mp3':
    return loadAudio(file)
  case 'json':
    return loadJSON(file)
  case 'aseprite':
    return loadAseprite(file)
  default:
    return loadFile(file)
  }
}

export const preload = <Type>(files: string[]): Promise<Type[]> => {
  const promises: Promise<Type>[] = []

  for (let i = 0, l = files.length; i < l; i += 1) {
    promises.push(load<Type>(files[i]))
  }

  return Promise.all(promises)
}
