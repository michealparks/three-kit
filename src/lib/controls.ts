const pressedKeys: Set<string> = new Set()

const events = new Map<string, ((key: string) => void)[]>()

let gamepadConnected = false
let keyboardControlling = false

export const update = () => {
  if (gamepadConnected === false || keyboardControlling === true) {
    return
  }

  const [gamepad] = navigator.getGamepads()

  if (gamepad === null) {
    return
  }

  handleGamepad(gamepad)

  if (gamepad.id.toLowerCase().includes('xbox 360 controller')) {
    return 
  }
}

export interface GamepadState {
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

const handleGamepad = ({ axes, buttons }: Gamepad) => {
  gamepad.leftStickX = axes[0]
  gamepad.leftStickY = axes[1]
  gamepad.rightStickX = axes[2]
  gamepad.rightStickY = axes[3]

  gamepad.A = buttons[0]
  gamepad.B = buttons[1]
  gamepad.X = buttons[2]
  gamepad.Y = buttons[3]

  gamepad.leftBumper = buttons[4]
  gamepad.rightBumper = buttons[5]
  gamepad.leftTrigger = buttons[6]
  gamepad.rightTrigger = buttons[7]

  gamepad.back = buttons[8]
  gamepad.start = buttons[9]

  gamepad.leftStickButton = buttons[10]
  gamepad.rightStickButton = buttons[11]

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
  const gamepad = navigator.getGamepads()[0]

  if (gamepad === null) {
    return
  }

  gamepadConnected = true
  window.addEventListener('gamepaddisconnected', handleGamepadDisconnected)
}

const handleGamepadDisconnected = () => {
  gamepadConnected = false
}

window.addEventListener('keydown', handleKeyDown, { passive: true })
window.addEventListener('keyup', handleKeyUp, { passive: true })
window.addEventListener('gamepadconnected', handleGamepadConnected)
