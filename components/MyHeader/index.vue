<template>
  <div class="my-header">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-sub-menu index="2">
        <template #title>bloniea-管理员</template>
        <el-menu-item index="2-1" @click="showResetPwd">修改</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="3" @click="logout">登出</el-menu-item>
    </el-menu>

    <el-dialog
      class="add-dialog"
      v-model="userDialogVisible"
      destroy-on-close
      :close-on-click-modal="false"
      title="添加分类"
      width="40%"
      @close="cenael(userFormRef)"
    >
      <div>
        <el-form
          :model="userForm"
          :rules="rules"
          ref="userFormRef"
          label-width="auto"
        >
          <el-form-item label="旧密码" prop="password">
            <el-input
              v-model="userForm.password"
              type="password"
              placeholder="请输入旧密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="userForm.newPassword"
              type="password"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="userForm.confirmPassword"
              type="password"
              placeholder="请输入确认密码"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cenael(userFormRef)">取消</el-button>
          <el-button
            type="primary"
            @click="submit(userFormRef)"
            :loading="btnLoading"
          >
            添加
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"

const activeIndex = ref("1")
const activeIndex2 = ref("1")
const handleSelect = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}

const logout = () => {
  useToken().value = ""
  useRefreshToken().value = ""
  useUserInfo().value = undefined
  useLoginStatus().value = false
  clearCookie(["token", "refreshToken", "user"])
  navigateTo("/login")
}

const userDialogVisible = ref<boolean>(false)
interface ResetPwd {
  password: string
  newPassword: string
  confirmPassword: string
}
const userForm = reactive(<ResetPwd>{
  password: "",
  newPassword: "",
  confirmPassword: "",
})
const confirmPasswordRule = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入确认密码"))
  } else if (value !== userForm.newPassword) {
    callback(new Error("两次密码不相同!"))
  } else {
    callback()
  }
}
const rules = {
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  confirmPassword: [{ required: true, validator: confirmPasswordRule }],
}
const userFormRef = ref<FormInstance>()
const btnLoading = ref<boolean>(false)
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const editUser = {
          password: sha256(userForm.password),
          newPassword: sha256(userForm.newPassword),
          confirmPassword: sha256(userForm.confirmPassword),
        }
        const res = await resetPwdApi(editUser)
        btnLoading.value = false
        if (res.success) {
          userDialogVisible.value = false
          formEl.resetFields()
          ElMessage.success("修改成功")
        } else if (res.status === 401) {
          ElMessage.error("修改失败,旧密码错误")
        } else if (res.status === 400) {
          ElMessage.error("修改失败,两次密码不相同")
        }
      } finally {
        btnLoading.value = false
      }
    } else {
      console.log("error submit!", fields)
    }
  })
}
const showResetPwd = async () => {
  userDialogVisible.value = true
}
const cenael = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  userDialogVisible.value = false
}
</script>

<style lang="stylus" scoped>
.my-header
  :deep(ul)
    justify-content: end;
</style>
