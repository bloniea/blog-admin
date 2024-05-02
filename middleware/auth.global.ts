interface User {
  user_id: number
  username: string
  email: string
  role_id: number
}
export default defineNuxtRouteMiddleware(async (to, from) => {
  const status = useLoginStatus()
  const user = useCookie("user").value as unknown as User | undefined
  const token = useCookie("token").value as unknown as string
  const refreshToken = useCookie("refreshToken").value as unknown as string

  if (user) {
    if (to.path === "/login") return navigateTo("/")
  } else {
    if (to.path !== "/login") return navigateTo("/login")
  }
})
