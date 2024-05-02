interface User {
  user_id: number
  username: string
  email: string
  role_id: number
}
export default defineNuxtPlugin((nuxtApp) => {
  const user = useCookie("user").value as unknown as User
  const token = useCookie("token").value as unknown as string
  const refreshToken = useCookie("refreshToken").value as unknown as string
  if (user && (token || refreshToken)) {
    useUserInfo().value = user
    useToken().value = token
    useRefreshToken().value = refreshToken
    useLoginStatus().value = true
  } else {
    useUserInfo().value = undefined
    useToken().value = ""
    useRefreshToken().value = ""
    useLoginStatus().value = false
  }
})
