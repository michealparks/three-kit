import * as THREE from 'three'
import { GroundProjectedEnv } from 'three/examples/jsm/objects/GroundProjectedEnv'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

const presetsObj = {
  apartment: 'lebombo/lebombo_1k.hdr',
  city: 'potsdamer-platz/potsdamer_platz_1k.hdr',
  dawn: 'kiara/kiara_1_dawn_1k.hdr',
  forest: 'forrest-slope/forest_slope_1k.hdr',
  lobby: 'st-fagans/st_fagans_interior_1k.hdr',
  night: 'dikhololo/dikhololo_night_1k.hdr',
  park: 'rooitou/rooitou_park_1k.hdr',
  studio: 'studio-small-3/studio_small_03_1k.hdr',
  sunset: 'venice/venice_sunset_1k.hdr',
  warehouse: 'empty-wharehouse/empty_warehouse_01_1k.hdr',
}

type PresetsType = keyof typeof presetsObj

const CUBEMAP_ROOT = 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/hdris/'

interface Props {
  frames?: number
  near?: number
  far?: number
  resolution?: number
  background?: boolean | 'only'
  map?: THREE.Texture
  files?: string | string[]
  path?: string
  preset?: PresetsType
  scene: THREE.Scene
  ground?: {
    radius?: number
    height?: number
    scale?: number
  }
  encoding?: THREE.TextureEncoding
}

interface Map { map: THREE.Texture }

export const environmentMap = ({ scene, background = false, map }: Props & Map) => {
  const oldbg = scene.background
  const oldenv = scene.environment
  if (background !== 'only') {
    scene.environment = map
  }

  if (background) {
    scene.background = map
  }

  return () => {
    if (background !== 'only') {
      scene.environment = oldenv
    }

    if (background) {
      scene.background = oldbg
    }
  }
}

const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()

export const fetchEnvironment = ({
  files = ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'],
  path = '',
  preset = undefined,
  encoding = undefined,
}: Partial<Props>): Promise<THREE.CubeTexture | THREE.DataTexture> => {
  let localFiles = files
  let localPath = path

  if (preset) {
    if (!(preset in presetsObj)) {
      throw new Error(`Preset must be one of: ${Object.keys(presetsObj).join(', ')}`)
    }
    localFiles = presetsObj[preset]
    localPath = CUBEMAP_ROOT
  }

  let resolver: (value: THREE.CubeTexture | THREE.DataTexture) => void

  const isCubeMap = Array.isArray(localFiles)

  const handleLoaded = (texture: THREE.CubeTexture | THREE.DataTexture) => {
    texture.mapping = isCubeMap
      ? THREE.CubeReflectionMapping
      : THREE.EquirectangularReflectionMapping
    texture.encoding = encoding ?? isCubeMap
      ? THREE.sRGBEncoding
      : THREE.LinearEncoding
    resolver(texture)
  }

  if (isCubeMap) {
    cubeTextureLoader.setPath(localPath)
    cubeTextureLoader.load(localFiles as string[], handleLoaded)
  } else {
    rgbeLoader.setPath(localPath)
    rgbeLoader.load(localFiles as string, handleLoaded)
  }

  return new Promise((resolve) => {
    resolver = resolve
  })
}

export const environmentCube = async ({ background = false, scene, ...rest }: Props) => {
  const texture = await fetchEnvironment(rest)
  const oldbg = scene.background
  const oldenv = scene.environment

  if (background !== 'only') {
    scene.environment = texture
  }

  if (background) {
    scene.background = texture
  }

  return () => {
    if (background !== 'only') {
      scene.environment = oldenv
    }

    if (background) {
      scene.background = oldbg
    }
  }
}

const environmentGround = async (props: Props) => {
  const textureDefault = await fetchEnvironment(props)
  const texture = props.map ?? textureDefault
  const { height, radius, scale = 1000 } = props.ground!

  const dispose = environmentMap({
    ...props,
    map: texture,
  })
  const mesh = new GroundProjectedEnv(texture, {
    height,
    radius,
  })
  mesh.scale.setScalar(scale)

  return () => {
    dispose()
    mesh.geometry.dispose()
    mesh.material.dispose()
    // @ts-expect-error This exists :P
    mesh.material.map?.dispose()
  }
}

export const environment = (props: Props) => {
  if (props.ground) {
    return environmentGround(props)
  }

  if (props.map) {
    return environmentMap(props as Props & Map)
  }

  return environmentCube(props)
}
