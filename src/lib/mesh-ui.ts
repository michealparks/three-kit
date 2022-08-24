import * as ThreeMeshUI from 'three-mesh-ui'
import { update } from './update'

const font = import.meta.env.THREE_MESH_UI_FONT

export interface Options {
  width?: number
  height?: number
  padding?: number
  borderRadius?: number
  fontSize?: number
  justifyContent?:
    | 'start'
    | 'center'
    | 'end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  contentDirection?: 'row-reverse'
}

export const createBlock = ({
  width = 1,
  height = 0.5,
  padding = 0.1,
  borderRadius = 0,
  fontSize = 0.07,
  justifyContent = 'center',
  contentDirection = 'row-reverse',
}: Options = {}) => {
  return new ThreeMeshUI.Block({
    borderRadius,
    contentDirection,
    fontFamily: `${font}.json`,
    fontSize,
    fontTexture: `${font}.png`,
    height,
    justifyContent,
    padding,
    width,
  })
}

export const createText = (content: string, fontSize?: number, fontColor?: string) => {
  return new ThreeMeshUI.Text({
    content,
    fontColor,
    fontSize,
  })
}

export const createTextBlock = (content: string, options?: Options) => {
  const block = createBlock(options)
  const text = createText(content)
  block.add(text)
  return block
}

if (import.meta.env.THREE_MESH_UI === 'true') {
  update(() => {
    ThreeMeshUI.update()
  })
}
