export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:created", () => {
    // const token = useCookie("token")
    // const refreshToken = useCookie("refreshToken")
    // const user = useCookie("user")
    const a = { b: "sdad.^@#$#$@^$%^@!#%$)()&^$%" }
    const b = useCookie("a", {
      maxAge: 60 * 60 * 24 * 30,
      default: () => a,
    })
    // const a = useCookie("a") as { value: { b: string } }
    // console.log(a)
    // if (a.value) {
    //   console.log(a.value.b, "插件")
    // }
    // console.log(user, refreshToken, token)
    // console.log(cookie, "插件")
    // console.log(useLoginStatus().value, "插件")
  })
})
