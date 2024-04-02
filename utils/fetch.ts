export interface Result {
  success: number
  data: any
  message: string
  status: number
}

type Method = "GET" | "POST" | "PATCH" | "DELETE"
export const http = async (
  url: string,
  method: Method = "GET",
  data: any = null,
  options?: RequestInit | undefined,
  timeout: number = 5000, // 默认超时时间为5秒
  maxRetries: number = 3 // 默认最大重试次数为3次
): Promise<Result> => {
  let retries = 0
  let resultData: Result
  do {
    try {
      const controller = new AbortController()
      const signal = controller.signal

      // 设置超时处理
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, timeout)

      type AuthHeader = { Authorization: string } | {}
      const auth: AuthHeader = useToken().value
        ? { Authorization: "Bearer " + useToken().value }
        : {}
      const opts = {
        ...options,
        headers: { "Content-Type": "application/json", ...auth },
        method: method,
        signal, // 将AbortController关联到请求中
      }
      let urlFilter: string = url
      if (method === "GET" || method === "DELETE") {
        if (retries === 0) {
          const params = data ? new URLSearchParams(data).toString() : ""
          urlFilter = params ? `${url}?${params}` : url
        }
      } else if (method === "POST" || method === "PATCH") {
        opts.body = JSON.stringify(data)
        urlFilter = url
      }
      const result = await fetch(urlFilter, opts)
      clearTimeout(timeoutId) // 清除超时处理的定时器
      const _result: Result = await result.json()

      // 刷新成功逻辑

      if (
        result.status === 200 &&
        _result &&
        _result.data &&
        _result.data.refresh
      ) {
        const token = useCookie("token", { maxAge: 60 * 60 * 6 })
        token.value = _result.data.token
        useToken().value = _result.data.token
        useRefreshToken().value = _result.data.refreshToken

        const obj = useSaveFetch().value ? JSON.parse(useSaveFetch().value) : ""
        if (obj) {
          return await http(obj.url, obj.method, obj.data, obj.options)
        }
      }
      if ([401].includes(result.status)) {
        // token失效（或被改过）返回401，使用refreshToken刷新token
        // 如果refreshToken失效（或被改过），跳转到登录页
        // 只有token失效才有{data: "Token invalid}

        if (_result.data === "Token invalid") {
          // token失效，先存储上一次的请求
          useSaveFetch().value = JSON.stringify({ url, method, data, options })
          // 使用refreshToken刷新token
          const refreshToken = useRefreshToken()
          if (refreshToken.value) {
            useSaveRefreshToken().value = "refreshToken"
            return await http("/api/refreshToken", "POST", {
              refreshToken: "Bearer " + refreshToken.value,
            })
          }
        }
        // 请求refreshToken还是返回401，跳转到登录页
        if (useSaveRefreshToken().value === "refreshToken") {
          // 清除状态和localStorage
          useSaveRefreshToken().value = ""
          useToken().value = ""
          useLoginStatus().value = false
          useToken().value = ""
          useRefreshToken().value = ""
          useCookie("token").value = null
          useCookie("refreshToken").value = null
          useCookie("user").value = null
          navigateTo("/login")
        }
        // 等我想想写什么
      }

      if ([500].includes(result.status)) {
        console.error(_result.message)
        ElMessage({ message: "服务器错误,不妙啊,稍后重试看看", type: "error" })
      }
      resultData = { ..._result, status: result.status }
      if (result.status === 200) {
        // 清除存在状态证明请求刷新  useSaveRefreshToken
        useSaveRefreshToken().value = ""
      }
      resultData = { ..._result, status: result.status }
      return resultData
    } catch (error) {
      useSaveRefreshToken().value = ""
      if (retries >= maxRetries) {
        // 如果达到最大重试次数仍然失败，则抛出错误
        ElMessage({ message: "请求超时", type: "error" })
        throw error
      } else {
        // 等待一段时间后重试
        retries++
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // ElMessage({ message: "请求超时", type: "error" })
      // throw new Error(error instanceof Error ? error.message : String(error))
    }
  } while (retries < maxRetries)
  throw new Error("请求失败")
}
/**
 *
 * @param query 请求体
 * @returns 返回结果
 */
export const loginApi = async (query: {
  username: string
  password: string
}) => {
  const result = await http("/api/login", "POST", query)
  return result
}

export const getArticle = async (id: number) => {
  const result = await http(`/api/article/${id}`, "GET")
  return result
}
/**
 *
 * @returns 获取全部角色
 */
export const getRolesApi = async (query?: { keyword: string | number }) => {
  const result = await http(`/api/roles`, "GET", query)
  return result
}

export const getPermissionApi = async () => {
  const result = await http(`/api/permissions`, "GET")
  return result
}
type Role = {
  name: string
  description?: string
  permissions?: string
}
export const addRoleApi = async (query: Role) => {
  const result = await http(`/api/role`, "POST", query)
  return result
}
export const deleteRoleApi = async (id: number) => {
  const result = await http(`/api/role/${id}`, "DELETE")
  return result
}
export const updateRoleApi = async (id: number, query: Role) => {
  const result = await http(`/api/role/${id}`, "PATCH", query)
  return result
}
export const getUsersApi = async (query: { keyword: string | number }) => {
  const result = await http(`/api/users`, "GET", query)
  return result
}

export const addUserApi = async (query: any) => {
  const result = await http(`/api/user`, "POST", query)
  return result
}
export const delUserApi = async (id: number) => {
  const result = await http(`/api/user/${id}`, "DELETE")
  return result
}

export const refreshTokenApi = async (query: { refreshToken: string }) => {
  const result = await http(`/api/refreshToken`, "POST", query)
  return result
}
export const updateUserApi = async (id: number, query: any) => {
  const result = await http(`/api/user/${id}`, "PATCH", query)
  return result
}
export const getCategoriesApi = async (query?: {
  keyword: string
  pages: number
  pageNumber: number
}) => {
  const result = await http(`/api/categories`, "GET", query)
  return result
}

export const addCategoryApi = async (query: {
  name: string
  img_url: string
}) => {
  const reuslt = await http("/api/category", "POST", query)
  return reuslt
}

export const editCategoryApi = async (
  id: number,
  query: { name?: string; img_url?: string }
) => {
  const result = await http(`/api/category/${id}`, "PATCH", query)
  return result
}
export const deleteCategoryApi = async (id: number) => {
  const result = await http(`/api/category/${id}`, "DELETE")
  return result
}
interface GetQuery {
  keyword: string
  pageNumber: number
  pages: number
}
export const getArticlesApi = async (query: GetQuery) => {
  const result = await http(`/api/articles`, "GET", query)
  return result
}
interface Article {
  title: string
  content: string
  img_url: string
  img_source: string
  category_id: number
}
export const addArticleApi = async (data: Article) => {
  const result = await http(`/api/article`, "POST", data)
  return result
}
export const deleteArticleApi = async (id: number) => {
  const result = await http(`/api/article/${id}`, "DELETE")
  return result
}
export const getArticleApi = async (id: string) => {
  const result = await http(`/api/article/${id}`, "GET")
  return result
}
export const updateArticleApi = async (id: string, data: Article) => {
  const result = await http(`/api/article/${id}`, "PATCH", data)
  return result
}
export const getInfoApi = async () => {
  const result = await http(`/api/info`, "GET")
  return result
}
interface ResetPwd {
  password: string
  newPassword: string
  confirmPassword: string
}
export const resetPwdApi = async (data: ResetPwd) => {
  const result = await http(`/api/resetPwd`, "POST", data)
  return result
}
