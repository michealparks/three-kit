export const get = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}')
  } catch {
    return {}
  }
}

export const set = (key: string, value: object) => {
  localStorage.setItem(key, JSON.stringify(value))
}