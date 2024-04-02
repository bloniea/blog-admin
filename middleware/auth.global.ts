export default defineNuxtRouteMiddleware(async (to, from) => {
  const isLogin = useLoginStatus()
  if (to.path !== "/login") {
    if (!isLogin.value) {
      const refreshToken = useRefreshToken()
      if (refreshToken.value) {
        const refreshTokenResult = await refreshTokenApi({
          refreshToken: "Bearer " + refreshToken.value,
        })
      } else {
        return navigateTo("/login")
      }
    }
  } else {
    if (isLogin.value) {
      return navigateTo("/")
    }
  }
})
