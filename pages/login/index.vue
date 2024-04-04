<template>
  <div class="login">
    <div class="title">
      <h1>HERTA DATABASE</h1>
    </div>

    <div class="content">
      <h2>SIGN IN</h2>
      <el-form
        ref="ruleFormRef"
        class="form"
        :model="user"
        :rules="rules"
        :inline="true"
        label-position="left"
      >
        <el-form-item
          label="Email / Username"
          class="form-item"
          prop="username"
        >
          <el-input
            placeholder="Email / Username"
            icon="i-heroicons-user"
            v-model="user.username"
            autocomplete="current-username"
            class="form-input"
            :prefix-icon="User"
            @keyup.enter="onSubmit(ruleFormRef)"
          />
        </el-form-item>
        <el-form-item label="Password" class="form-item" prop="password">
          <el-input
            placeholder="Password"
            type="password"
            icon="i-heroicons-lock-closed"
            v-model="user.password"
            autocomplete="current-password"
            class="form-input"
            :prefix-icon="Lock"
            @keyup.enter="onSubmit(ruleFormRef)"
            show-password
          />
        </el-form-item>
        <!-- <div class="pwd-skip">Forgot Password ?</div> -->
        <div class="lgoin-btn">
          <el-button @click="onSubmit(ruleFormRef)" :loading="btnLoading">
            LOGIN IN</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { Lock, User } from "@element-plus/icons-vue"
const router = useRouter()

definePageMeta({
  layout: "login",
})
interface RuleForm {
  username: string
  password: string
}
const user = reactive<RuleForm>({
  username: "",
  password: "",
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<RuleForm>>({
  username: [
    {
      required: true,
      message: "用户名呢",
      trigger: "blur",
    },
  ],
  password: [{ required: true, message: "密码呢", trigger: "blur" }],
})
// 创建1个cookie
const token = useCookie("token", { maxAge: 60 * 60 * 6 })
const refreshToken = useCookie("refreshToken", { maxAge: 60 * 60 * 24 * 7 })
const userinfo = useCookie("user", { maxAge: 60 * 60 * 24 * 365 * 10 })
const btnLoading = ref<boolean>(false)
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      btnLoading.value = true
      const userReq = {
        username: user.username,
        password: sha256(user.password),
      }
      const result = await loginApi(userReq)
      if (result.success) {
        token.value = result.data.token //存入cookie
        refreshToken.value = result.data.refreshToken
        userinfo.value = result.data.user
        useUser().value = result.data.user //存入状态管理
        useToken().value = result.data.token
        useRefreshToken().value = result.data.refreshToken
        useLoginStatus().value = true
        ElMessage({ message: "登录成功", type: "success" })
        router.push("/dashboard")
      } else {
        ElMessage({ message: "用户或密码错误", type: "error" })
      }
      btnLoading.value = false
    } else {
      console.log("error submit!", fields)
    }
  })
}
</script>

<style lang="stylus" scoped>
@import url("./index.styl")
</style>
