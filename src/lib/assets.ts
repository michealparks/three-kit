import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export const manager = new THREE.LoadingManager()
export const textureLoader = new THREE.TextureLoader(manager)
export const audioLoader = new THREE.AudioLoader(manager)
export const gltfLoader = new GLTFLoader(manager)
export const cache = new Map()

textureLoader.setPath(DIR_TEXTURES)
audioLoader.setPath(DIR_AUDIO)
gltfLoader.setPath(DIR_GLB)

export const loadJSON = async (file: string) => {
  const result = cache.get(file)

  if (result !== undefined) {
    return result
  }

  const response = await fetch(`${DIR_JSON}/${file}`)
  const json = await response.json()
  cache.set(file, json)
  return json
}

export const loadFile = async (file: string) => {
  const result = cache.get(file)

  if (result !== undefined) {
    return result
  }

  const response = await fetch(`${DIR_FILE}/${file}`)
  const text = await response.text()
  cache.set(file, text)
  return text
}

export const loadTexture = async (file: string) => {
  const result = cache.get(file)

  if (result !== undefined) {
    return result
  }

  const texture = await textureLoader.loadAsync(file)
  cache.set(file, texture)
  return texture
}

export const loadAudio = async (file: string) => {
  const result = cache.get(file)

  if (result !== undefined) {
    return result
  }

  const audio = await audioLoader.loadAsync(file)
  cache.set(file, audio)
  return audio
}

export const loadGLTF = async (file: string) => {
  const result = cache.get(file)

  if (result !== undefined) {
    return result
  }

  const gltf = await gltfLoader.loadAsync(file)
  cache.set(file, gltf)
  return gltf
}

const toJSON = (result: Response) => {
  return result.json()
}

export const loadAseprite = async (file: string) => {
  const result = cache.get(file)

  if (result !== undefined) {
    return result
  }

  const url = `${DIR_TEXTURES}/${file.replace('sprite', 'json')}`
  const [data, tex] = await Promise.all([
    fetch(url).then(toJSON),
    textureLoader.loadAsync(file.replace('sprite', 'png')),
  ])

  const sprite = {
    frames: data.frames,
    meta: data.meta,
    texture: tex,
  }

  cache.set(file, sprite)

  return sprite
}

export const get = <Type>(file: string): Type => {
  return cache.get(file)
}

const loadOne = (file: string) => {
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

export const load = <Type>(file: string): Promise<Type> => {
  return loadOne(file)
}

export const preload = <Type>(files: string[]): Promise<Type[]> => {
  const promises: Promise<Type>[] = []

  for (let i = 0, l = files.length; i < l; i += 1) {
    promises.push(load<Type>(files[i]))
  }

  return Promise.all(promises)
}
