const pressedKeys: Set<string> = new Set()

const events = new Map<string, ((key: string) => void)[]>()

let keyboardControlling = false

export interface GamepadState {
  connected: boolean
  leftStickX: number
  leftStickY: number
  rightStickX: number
  rightStickY: number
  padX: number
  padY: number
  A: GamepadButton
  B: GamepadButton
  X: GamepadButton
  Y: GamepadButton
  leftBumper: GamepadButton
  rightBumper: GamepadButton
  leftTrigger: GamepadButton
  rightTrigger: GamepadButton
  back: GamepadButton
  start: GamepadButton
  leftStickButton: GamepadButton
  rightStickButton: GamepadButton
}

export const gamepad: GamepadState = {
  connected: false,
  leftStickX: 0,
  leftStickY: 0,
  rightStickX: 0,
  rightStickY: 0,
  padX: 0,
  padY: 0,
  A: undefined!,
  B: undefined!,
  X: undefined!,
  Y: undefined!,
  leftBumper: undefined!,
  rightBumper: undefined!,
  leftTrigger: undefined!,
  rightTrigger: undefined!,
  back: undefined!,
  start: undefined!,
  leftStickButton: undefined!,
  rightStickButton: undefined!,
}

export const update = () => {
  if (gamepad.connected === false || keyboardControlling === true) {
    return
  }

  const [pad1, pad2] = navigator.getGamepads()

  console.log(pad1, pad2)

  if (!pad1 && !pad2) {
    return
  }

  handleGamepad(pad1! || pad2!)
}

const handleGamepad = ({ axes, buttons }: Gamepad) => {
  gamepad.leftStickX = axes[0]
  gamepad.leftStickY = axes[1]
  gamepad.rightStickX = axes[2]
  gamepad.rightStickY = axes[3]

  gamepad.A = buttons[0].value
  gamepad.B = buttons[1].value
  gamepad.X = buttons[2].value
  gamepad.Y = buttons[3].value

  gamepad.leftBumper = buttons[4].value
  gamepad.rightBumper = buttons[5].value
  gamepad.leftTrigger = buttons[6].value
  gamepad.rightTrigger = buttons[7].value

  gamepad.back = buttons[8].value
  gamepad.start = buttons[9].value

  gamepad.leftStickButton = buttons[10].value
  gamepad.rightStickButton = buttons[11].value

  gamepad.padY = buttons[12].pressed ? -1 : buttons[13].pressed ? 1 : 0
  gamepad.padX = buttons[14].pressed ? -1 : buttons[15].pressed ? 1 : 0
}

const handleKeyDown = ({ key }: { key: string }) => {
  keyboardControlling = true

  pressedKeys.add(key)

  for (const key of pressedKeys) {
    for (const fn of events.get('keydown') ?? []) {
      fn(key)
    }
  }
}

const handleKeyUp = ({ key }: { key: string }) => {
  pressedKeys.delete(key)

  for (const fn of events.get('keyup') ?? []) {
    fn(key)
  }

  for (const key of pressedKeys) {
    for (const fn of events.get('keydown') ?? []) {
      fn(key)
    }
  }

  if (pressedKeys.size === 0) {
    keyboardControlling = false
  }
}

const handleGamepadConnected = () => {
  const [pad1, pad2] = navigator.getGamepads()

  if (!pad1 && !pad2) {
    return
  }

  console.log(pad1, pad2)

  gamepad.connected = true
  window.addEventListener('gamepaddisconnected', handleGamepadDisconnected)
}

const handleGamepadDisconnected = () => {
  gamepad.connected = false
}

window.addEventListener('keydown', handleKeyDown, { passive: true })
window.addEventListener('keyup', handleKeyUp, { passive: true })
window.addEventListener('gamepadconnected', handleGamepadConnected)
