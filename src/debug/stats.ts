import Stats from 'three/examples/jsm/libs/stats.module'

export const stats = Stats()
stats.dom.style.width = '80px'
stats.dom.style.height = '48px'

document.body.append(stats.dom)
