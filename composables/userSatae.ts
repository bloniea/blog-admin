import type { User } from "~/types/type"

export const useUser = () => {
  return useState("user", (): Record<string, any> | undefined => {
    const user = useCookie("user") as { value: User }
    return user.value || undefined
  })
}
export const useLoginStatus = () => {
  const token = useCookie("token")
  const refreshToken = useCookie("refreshToken")
  const user = useCookie("user")
  return useState("loginStatus", (): boolean =>
    token.value && refreshToken.value && user.value ? true : false
  )
}
export const useToken = () => {
  const token = useCookie("token")
  return useState("token", (): string => token.value || "")
}
export const useRefreshToken = () => {
  const refreshToken = useCookie("refreshToken")
  return useState("refreshToken", (): string => refreshToken.value || "")
}
export const useSaveFetch = () => {
  return useState("saveFetch", (): string => "")
}
export const useSaveRefreshToken = () => {
  return useState("saveRefreshToken", (): string => "")
}
