export default defineNuxtRouteMiddleware(async (to, from) => {
  const status = useLoginStatus()
  if (status) {
    if (to.path === "/login") return navigateTo("/")
  } else {
    return navigateTo("/login")
  }
})
