import { renderer } from './renderer'

export { enableTeleport, disableTeleport } from './xr-teleport'

let session: XRSession | undefined

export const xrState = {
  sessionGranted: false,
}

export const xrSupportState = {
  ALLOWED: 0,
  NOT_ALLOWED: 1,
  NOT_SECURE: 2,
  NOT_SUPPORTED: 3,
} as const

export const xrSupportStateMessage = {
  0: 'Enter XR',
  1: 'XR is not allowed',
  2: 'XR requires HTTPS',
  3: 'XR not supported',
} as const

export const requestXrSessionSupport = async () => {
  if (navigator.xr === undefined) {
    return xrSupportState.NOT_SUPPORTED
  }

  if (!window.isSecureContext) {
    return xrSupportState.NOT_SECURE
  }

  try {
    const supported = await navigator.xr.isSessionSupported('immersive-vr')

    if (supported) {
      return xrSupportState.ALLOWED
    }

    return xrSupportState.NOT_SUPPORTED
  } catch {
    return xrSupportState.NOT_ALLOWED
  }
}

export const requestSession = async () => {
  if (navigator.xr === undefined) {
    throw new Error('navigator.xr is undefined!')
  }

  session = await navigator.xr.requestSession('immersive-vr', {
    optionalFeatures: [
      'local-floor',
      'bounded-floor',
      'hand-tracking',
      'layers',
    ],
  })

  return renderer.xr.setSession(session)
}

export const endSession = () => {
  if (session === undefined) {
    throw new Error('Tried to end undefined session!')
  }
  session.end()
}

export const addButton = async (parent?: HTMLElement, style?: string) => {
  const xrSupport = await requestXrSessionSupport()
  const button = document.createElement('button')

  button.style.cssText = style ?? `
    font-family: monospace;
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    appearance: none;
    color: white;
    border: 1px solid white;
    background-color: transparent;
    padding: 0.75rem 1rem;
  `

  button.textContent = xrSupportStateMessage[xrSupport]

  if (kit__POSTPROCESSING) {
    button.textContent = 'XR and postprocessing not supported'
  } else if (xrSupport === xrSupportState.ALLOWED) {
    button.addEventListener('click', () => {
      return requestSession()
    })
  }

  const element = parent ?? document.body
  element.append(button)
}

if (kit__XR_ENABLED) {
  /*
   * WebXRViewer (based on Firefox) has a bug where addEventListener
   * throws a silent exception and aborts execution entirely.
   */
  if (
    navigator.xr === undefined ||
    (/WebXRViewer\//ui).test(navigator.userAgent)
  ) {
    // Do nothing
  } else {
    navigator.xr.addEventListener('sessiongranted', () => {
      xrState.sessionGranted = true
    })
  }

  if (kit__XR_BUTTON) {
    addButton()
  }
}
