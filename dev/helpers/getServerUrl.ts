export const __PORT = 4000
export const __HOST = 'localhost'
export const __PROTOCOL = 'http'

export const getServerUrl = () => {
  return `${__PROTOCOL}://${__HOST}:${__PORT}`
}
