export const useUserInfo = () => {
  return useState("user", (): Record<string, any> | undefined => undefined)
}
export const useLoginStatus = () => {
  return useState("loginStatus", (): boolean => false)
}
export const useToken = () => {
  return useState("token", (): string => "")
}
export const useRefreshToken = () => {
  return useState("refreshToken", (): string => "")
}
export const useSaveFetch = () => {
  return useState("saveFetch", (): string => "")
}
export const useSaveRefreshToken = () => {
  return useState("saveRefreshToken", (): string => "")
}
