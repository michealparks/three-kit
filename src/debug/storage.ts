const get = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}')
  } catch {
    return {}
  }
}

const set = (key: string, value: object) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage = get('threekit.debug')

export const save = (key: string, value: string | number | boolean | Record<string, unknown>) => {
  storage[key] = value
  set('threekit.debug', storage)
}
