import { defineStore } from "pinia"

const getDefaultUserVal = (): Record<string, any> | undefined => {
  const user = window.localStorage.getItem("user")
  const token = window.localStorage.getItem("token")
  const refreshToken = window.localStorage.getItem("refreshToken")

  // 检查用户信息是否完整并有效
  if (
    user &&
    token &&
    refreshToken &&
    user !== "undefined" &&
    token !== "undefined" &&
    refreshToken !== "undefined"
  ) {
    // 更新状态中的用户信息并返回
    const userVal = JSON.parse(user)
    return userVal
    //   return state.user
  } else {
    // 处理用户信息不完整或无效的情况，返回默认值或者 undefined
    return undefined
  }
}
interface State {
  count: number
  user: Record<string, any> | undefined
}
export const useStore = defineStore({
  id: "store",
  state: (): State => ({
    count: 0,
    user: undefined,
  }),
  getters: {
    // Getter 示例：获取 count 的平方
    squaredCount(state) {
      return state.count * state.count
    },

    isLogin(state): boolean {
      return !!state.user
    },
  },
  actions: {
    getUserVal() {
      const userval = getDefaultUserVal()
      this.user = userval
      //   return userval
    },
    // Action 示例：增加 count 的值
    increment() {
      this.count++
    },
    // 异步 Action 示例：增加 count 的值，并在 1 秒后重置为 0
    async incrementAndReset() {
      this.count++
      await new Promise((resolve) => setTimeout(resolve, 1000))
      this.count = 0
    },
  },
})
