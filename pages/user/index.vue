<template>
  <div class="user">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-input
            v-model="keyword"
            style="width: 240px"
            placeholder="请输入角色名"
            clearable
            :prefix-icon="Search"
            class="search"
            @keyup.enter="getUsers"
            @change="getAllUsers"
          />
          <el-button class="add-btn" @click="showAddForm"> 添加用户</el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="data" stripe style="width: 100%">
        <el-table-column type="index" width="50" />
        <el-table-column
          prop="username"
          label="用户名"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="rolename"
          label="角色"
          width="200"
        ></el-table-column>
        <el-table-column prop="created_at" label="时间">
          <template #default="scope">
            <div>{{ getDate(scope.row.created_at) }}</div>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.row.user_id, scope.row)"
              >Edit</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row.user_id)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加表单 -->
    <el-dialog
      v-model="addDialogVisible"
      destroy-on-close
      :close-on-click-modal="false"
      title="修改角色"
      width="40%"
      @close="addCenael(userFormRef)"
    >
      <div>
        <el-form
          :model="userForm"
          :rules="rules"
          ref="userFormRef"
          label-width="auto"
          v-loading="addLoading"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="userForm.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="userForm.email"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="userForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role_id">
            <el-select
              v-model="userForm.role_id"
              placeholder="Select"
              size="large"
              style="width: 240px"
            >
              <el-option
                v-for="item in roles"
                :key="item.role_id"
                :label="item.name"
                :value="item.role_id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addCenael(userFormRef)">取消</el-button>
          <el-button
            type="primary"
            @click="addSubmit(userFormRef)"
            :loading="addBtnLoading"
          >
            添加
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog
      v-model="editDialogVisible"
      destroy-on-close
      :close-on-click-modal="false"
      title="修改角色"
      width="40%"
      @close="editCenael(editUserFormRef)"
    >
      <div>
        <el-form
          :model="editUserForm"
          :rules="editRules"
          ref="editUserFormRef"
          label-width="auto"
          v-loading="editLoading"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              placeholder="不写则保持旧密码"
              v-model="editUserForm.password"
              type="password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role_id">
            <el-select
              v-model="editUserForm.role_id"
              placeholder="Select"
              size="large"
              style="width: 240px"
            >
              <el-option
                v-for="item in roles"
                :key="item.role_id"
                :label="item.name"
                :value="item.role_id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editCenael(editUserFormRef)">取消</el-button>
          <el-button
            type="primary"
            @click="editSubmit(editUserFormRef)"
            :loading="editBtnLoading"
          >
            修改
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { Search } from "@element-plus/icons-vue"
const keyword = ref<string | number>("")
interface User {
  user_id: number
  rolename: string
  username: string
  email: string
  created_at: string
}
const loading = ref<boolean>(true)
const data = ref<User[]>([])
const getUsers = async () => {
  try {
    loading.value = true
    const result = await getUsersApi({ keyword: keyword.value })

    data.value = result.data
    // console.log(result.data, result)
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  getUsers()
})

// 清空获取回全部数据
const getAllUsers = async (val: string) => {
  if (val === "") {
    await getUsers()
  }
}
// 表单验证规则
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入用户名"))
  } else {
    if (!/^[a-zA-Z]{3,10}$/.test(value)) {
      callback(new Error("用户名必须由3到10个字母"))
    }
    callback()
  }
}
const validateEmail = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入邮箱"))
  } else {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      callback(new Error("请输入正确的邮箱地址"))
    }
    callback()
  }
}
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"))
  } else {
    if (!/^[^\s]{6,18}$/.test(value)) {
      callback(new Error("密码必须是 6 到 18 个字符，并且不能包含空格"))
    }
    callback()
  }
}
// 表单验证
const rules: FormRules = {
  username: [{ required: true, validator: validateUsername, trigger: "blur" }],
  email: [{ required: true, validator: validateEmail, trigger: "blur" }],
  password: [{ required: true, validator: validatePass, trigger: "blur" }],
  role_id: [{ required: true, message: "请选择角色", trigger: "blur" }],
}
const userFormRef = ref<FormInstance>()
interface Role {
  role_id: number
  name: string
}
const roles = ref<Role[]>([])
// 添加
const addDialogVisible = ref<boolean>(false)
const addLoading = ref<boolean>(false)
const addBtnLoading = ref<boolean>(false)
const userForm = reactive({
  username: "",
  email: "",
  password: "",
  role_id: "",
})
const showAddForm = async () => {
  addDialogVisible.value = true
  addLoading.value = true
  if (roles.value.length) {
    addLoading.value = false
    return
  }
  const result = await getRolesApi()
  if (result.success) {
    roles.value = result.data
    addLoading.value = false
  }
}

const addSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        addBtnLoading.value = true
        userForm.password = sha256(userForm.password)
        const result = await addUserApi(userForm)
        if (result.success) {
          addBtnLoading.value = false
          formEl.resetFields()
          addDialogVisible.value = false
          ElMessage({ type: "success", message: "添加成功" })
          await getUsers()
        } else if (result.status === 409) {
          ElMessage({ type: "error", message: "添加失败,用户名或邮箱已存在" })
        } else if (result.status === 401 && result.data.auth === 0) {
          ElMessage({ type: "error", message: "添加失败,权限不足" })
        }
      } finally {
        addBtnLoading.value = false
      }
    } else {
      console.error("error submit!", fields)
    }
  })
}

// 删除
const handleDelete = async (id: number) => {
  const user = useUserInfo().value as User
  ElMessageBox.confirm("此操作将永久删除该用户, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const message = ElMessage({
        type: "info",
        message: "正在删除",
        duration: 0,
      })
      const result = await delUserApi(id)
      message.close()
      if (result.success) {
        ElMessage({ type: "success", message: "删除成功" })
        await getUsers()
      } else if (result.status === 404) {
        ElMessage({ type: "error", message: "删除失败,用户已不存在" })
      } else if (result.status === 401 && result.data.auth === 0) {
        ElMessage({ type: "error", message: "删除失败,权限不足" })
      }
    })
    .catch(() => {
      ElMessage({ type: "info", message: "已取消删除" })
    })
}
const addCenael = (formRef: FormInstance | undefined) => {
  if (!formRef) return
  formRef.resetFields()
  addDialogVisible.value = false
}

// 修改
const editUserForm = reactive({
  username: "",
  email: "",
  password: "",
  role_id: "",
})
const editUserFormRef = ref<FormInstance>()
const editDialogVisible = ref<boolean>(false)
const editLoading = ref<boolean>(false)
const editBtnLoading = ref<boolean>(false)
const userId = ref<number>(0)
const validateEditPass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback()
  } else {
    if (!/^[^\s]{6,18}$/.test(value)) {
      callback(new Error("密码必须是 6 到 18 个字符，并且不能包含空格"))
    }
    callback()
  }
}
const editRules: FormRules = {
  username: [{ required: true, validator: validateUsername, trigger: "blur" }],
  email: [{ required: true, validator: validateEmail, trigger: "blur" }],
  password: [{ required: false, validator: validateEditPass, trigger: "blur" }],
  role_id: [{ required: true, message: "请选择角色", trigger: "blur" }],
}
const editCenael = (formRef: FormInstance | undefined) => {
  if (!formRef) return
  formRef.resetFields()
  editDialogVisible.value = false
}
interface UserEdit {
  username: string
  email: string
  role_id: string
  password: string
}
const handleEdit = async (id: number, list: UserEdit) => {
  userId.value = id
  editUserForm.username = list.username
  editUserForm.email = list.email
  editUserForm.role_id = list.role_id
  editUserForm.password = list.password

  editDialogVisible.value = true
  editLoading.value = true
  if (roles.value.length) {
    editLoading.value = false
    return
  }
  const result = await getRolesApi()
  if (result.success) {
    roles.value = result.data
    editLoading.value = false
  }
}
const editSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        editBtnLoading.value = true
        if (userForm.password) userForm.password = sha256(userForm.password)
        const result = await updateUserApi(userId.value, userForm)
        if (result.success) {
          editBtnLoading.value = false
          formEl.resetFields()
          editDialogVisible.value = false
          ElMessage({ type: "success", message: "修改成功" })
          await getUsers()
        } else if (result.status === 404) {
          ElMessage({ type: "error", message: "修改失败,用户不存在" })
          formEl.resetFields()
        } else if (result.status === 409) {
          ElMessage({ type: "error", message: "修改失败,用户名或邮箱已存在" })
        } else if (result.status === 401 && result.data.auth === 0) {
          ElMessage({ type: "error", message: "修改失败,权限不足" })
        }
      } finally {
        editBtnLoading.value = false
      }
    } else {
      console.error("error submit!", fields)
    }
  })
}
</script>

<style lang="stylus" scoped></style>
