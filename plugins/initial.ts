export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.hook("app:mounted", () => {})
  if (process.client) {
    const user = window.localStorage.getItem("user")
    const token = window.localStorage.getItem("token")
    const refreshToken = window.localStorage.getItem("refreshToken")

    if (user && token && refreshToken) {
      useUserInfo().value = JSON.parse(user)
      useToken().value = token
      useRefreshToken().value = refreshToken
      useLoginStatus().value = true
    } else {
      clearLocal(["user", "token", "refreshToken"])
    }
  }
})
