export const pressedKeys: Set<string> = new Set()

let keyboardControlling = false

export const keyboard = {
  x: 0,
  y: 0,
  space: 0,
  q: 0,
  e: 0,
  shift: 0,
}

export const gamepad = {
  connected: false,
  leftStickX: 0,
  leftStickY: 0,
  rightStickX: 0,
  rightStickY: 0,
  padX: 0,
  padY: 0,
  A: 0,
  B: 0,
  X: 0,
  Y: 0,
  leftBumper: 0,
  rightBumper: 0,
  leftTrigger: 0,
  rightTrigger: 0,
  back: 0,
  start: 0,
  leftStickButton: 0,
  rightStickButton: 0,
}

export const update = () => {
  if (gamepad.connected === false || keyboardControlling === true) {
    return
  }

  const [pad1, pad2] = navigator.getGamepads()

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

const handleKey = (key: string, pressed: number) => {
  switch (key.toLowerCase()) {
  case 's':
  case 'arrowdown':
    keyboard.y = -1 * pressed
    break
  case 'w':
  case 'arrowup':
    keyboard.y = +1 * pressed
    break
  case 'a':
  case 'arrowleft':
    keyboard.x = -1 * pressed
    break
  case 'd':
  case 'arrowright':
    keyboard.x = +1 * pressed
    break
  case ' ':
    keyboard.space = +1 * pressed
    break
  case 'q':
  case 'e':
  case 'shift':
    keyboard[key as 'q' | 'e' | 'shift'] = +1 * pressed
    break
  }
}

const handleKeyDown = (event: { key: string }) => {
  const key = event.key.toLowerCase()
  keyboardControlling = true

  pressedKeys.add(key)

  for (const key of pressedKeys) {
    handleKey(key, 1)
  }
}

const handleKeyUp = (event: { key: string }) => {
  const key = event.key.toLowerCase()
  pressedKeys.delete(key)

  handleKey(key, 0)

  for (const key of pressedKeys) {
    handleKey(key, 1)
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

  gamepad.connected = true
  window.addEventListener('gamepaddisconnected', handleGamepadDisconnected)
}

const handleGamepadDisconnected = () => {
  gamepad.connected = false
}

if (import.meta.env.THREE_CONTROLS === 'true') {
  if (import.meta.env.THREE_CONTROLS_KEYBOARD === 'true') {
    window.addEventListener('keydown', handleKeyDown, { passive: true })
    window.addEventListener('keyup', handleKeyUp, { passive: true })
  }

  if (import.meta.env.THREE_CONTROLS_GAMEPAD === 'true') {
    window.addEventListener('gamepadconnected', handleGamepadConnected)
  }
}
