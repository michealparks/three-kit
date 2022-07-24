
let session: XRSession
let xrSessionIsGranted = false

export const registerSessionGrantedListener = () => {
  // WebXRViewer (based on Firefox) has a bug where addEventListener
  // throws a silent exception and aborts execution entirely.
  if (navigator.xr === undefined || /WebXRViewer\//i.test(navigator.userAgent)) {
    return false
  }

  navigator.xr.addEventListener('sessiongranted', () => {
    xrSessionIsGranted = true
  })

  return true
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
