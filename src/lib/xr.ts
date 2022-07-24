
let session: XRSession
let xrSessionIsGranted = false

export const xrSupportState = {
  NOT_SUPPORTED: 0,
  NOT_SECURE: 1,
  NOT_ALLOWED: 2,
  ALLOWED: 3
}

export const xrSupportStateMessage = {
  0: 'VR not supported',
  1: 'VR requires HTTPS',
  2: 'VR is not allowed',
  3: 'Enter VR'
}

export const requestXrSessionSupport = async () => {
  if (navigator.xr === undefined) {
    return xrSupportState.NOT_SUPPORTED
  }

  if (window.isSecureContext === false) {
    return xrSupportState.NOT_SECURE
  }
  
  try {
    const supported = await navigator.xr.isSessionSupported('immersive-vr')

    if (supported) {
      return xrSupportState.ALLOWED
    }

    return xrSupportState.NOT_SUPPORTED

  } catch (error) {
    console.error(error)

    return xrSupportState.NOT_ALLOWED
  }
}

export const registerSessionGrantedListener = () => {
  // WebXRViewer (based on Firefox) has a bug where addEventListener
  // throws a silent exception and aborts execution entirely.
  if (navigator.xr === undefined || /WebXRViewer\//i.test(navigator.userAgent)) {
    return
  }

  navigator.xr.addEventListener('sessiongranted', () => {
    xrSessionIsGranted = true
  })
}

export const requestSession = async (renderer: THREE.WebGLRenderer) => {
  session = await navigator.xr!.requestSession('immersive-vr', {
    optionalFeatures: [
      'local-floor',
      'bounded-floor',
      'hand-tracking',
      'layers'
    ]
  })

  return renderer.xr.setSession(session)
}

export const endSession = () => {
  session!.end()
}
