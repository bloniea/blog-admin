<template>
  <div class="role">
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
            @keyup.enter="getRoles"
            @change="getAllRoles"
          ></el-input>

          <el-button class="add-btn" @click="showAddForm"> 添加角色</el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="data" stripe style="width: 100%">
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="名字" width="200"></el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          width="300"
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
              @click="handleEdit(scope.row.role_id, scope.row)"
              >Edit</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row.role_id)"
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
      title="添加角色"
      width="40%"
    >
      <div class="addForm">
        <el-form
          :model="addRoleForm"
          :rules="rules"
          ref="roleFormRef"
          label-width="auto"
          v-loading="addLoading"
        >
          <el-form-item label="角色名" prop="name">
            <el-input v-model="addRoleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="addRoleForm.description"></el-input>
          </el-form-item>
          <el-form-item label="权限" prop="permissions">
            <el-tree
              style="max-width: 600px"
              :data="permissions"
              :props="props"
              show-checkbox
              node-key="permission_id"
              @check="setCheckedKeys"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addCenael(roleFormRef)">取消</el-button>
          <el-button
            type="primary"
            @click="addSubmit(roleFormRef)"
            :loading="addBtnLoading"
          >
            添加
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 修改表单 -->
    <el-dialog
      v-model="editDialogVisible"
      destroy-on-close
      :close-on-click-modal="false"
      title="修改角色"
      width="40%"
    >
      <div>
        <el-form
          :model="editRoleForm"
          :rules="rules"
          ref="editRoleFormRef"
          label-width="auto"
          v-loading="editLoading"
        >
          <el-form-item label="角色名" prop="name">
            <el-input v-model="editRoleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="editRoleForm.description"></el-input>
          </el-form-item>
          <el-form-item label="权限" prop="permissions">
            <el-tree
              style="max-width: 600px"
              :data="permissions"
              :props="props"
              show-checkbox
              node-key="permission_id"
              @check="setEditCheckedKeys"
              :default-checked-keys="defaultExpandedKeys"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editCenael(editRoleFormRef)">取消</el-button>
          <el-button
            type="primary"
            @click="editSubmit(editRoleFormRef)"
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
import { Search } from "@element-plus/icons-vue"
import type { FormInstance, FormRules } from "element-plus"

const loading = ref<boolean>(true)
type Role = {
  name: string
  description: string
  created_at: string
  role_id: number
  permissions: string
}
const keyword = ref<string | number>("")
const data = ref<Array<Role>>([])
// 获取角色列表
const getRoles = async () => {
  data.value = []
  loading.value = true
  const roles = await getRolesApi({ keyword: keyword.value })
  if (roles.success) {
    roles.data.forEach((role: Role) => {
      data.value.push({
        name: role.name,
        description: role.description,
        created_at: role.created_at,
        role_id: role.role_id,
        permissions: role.permissions,
      })
    })
    loading.value = false
  }
}
// 执行获取角色列表方法
getRoles()
const getAllRoles = async (val: string) => {
  if (val === "") {
    await getRoles()
  }
}
// 添加角色
const roleFormRef = ref<FormInstance>()
const rules: FormRules = {
  name: [{ required: true, message: "请输入角色名", trigger: "blur" }],
}
// 添加表单数据
const addRoleForm = reactive({
  name: "",
  description: "",
  permissions: "",
})
// 控制表单显示隐藏
const addDialogVisible = ref<boolean>(false)

interface Tree {
  description: string
  permission_id: number
  level: number
  parent_id: string
  children?: Tree[]
}

const props = {
  label: "description",
  children: "children",
}

const permissions = ref<Tree[]>([])

interface CheckedInfo {
  checkedKeys: string[] // 选中的节点的 key 数组
}
// 选中的节点的 key 数组转为字符串
const setCheckedKeys = (obj: Tree, checkedInfo: CheckedInfo) => {
  addRoleForm.permissions = checkedInfo.checkedKeys.join(",")
}
// add 获取权限树节点load
const addLoading = ref<boolean>(true)
// 显示添加表单
const showAddForm = async () => {
  addDialogVisible.value = true
  addLoading.value = true
  if (permissions.value.length) {
    addLoading.value = false
    return
  }
  const result = await getPermissionApi()
  if (result.success) {
    permissions.value = result.data
    addLoading.value = false
  }
}
// 取消添加
const addCenael = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  addDialogVisible.value = false
}
// 执行添加
const addBtnLoading = ref<boolean>(false)
const addSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        addBtnLoading.value = true
        const result = await addRoleApi(addRoleForm)
        if (result.success) {
          formEl.resetFields()
          addDialogVisible.value = false
          ElMessage({ message: "添加成功", type: "success" })
          await getRoles()
        } else if (result.status === 409) {
          ElMessage({ message: "添加失败,角色名已存在", type: "error" })
        } else if (result.status === 401 && result.data.auth === 0) {
          ElMessage({ message: "添加失败,权限不足", type: "error" })
        }
      } finally {
        addBtnLoading.value = false
      }
    } else {
      console.log("error submit!", fields)
    }
  })
}

const handleDelete = async (id: number) => {
  ElMessageBox.confirm("此操作将永久删除该角色, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const message = ElMessage({
        message: "正在删除...",
        type: "info",
        duration: 0,
      })
      const result = await deleteRoleApi(id)
      message.close()
      if (result.success) {
        ElMessage({ message: "删除成功", type: "success" })
        await getRoles()
      } else if (result.status === 404) {
        ElMessage({ message: "删除失败,角色已不存在", type: "error" })
      } else if (result.status === 401 && result.data.auth === 0) {
        ElMessage({ message: "删除失败,权限不足", type: "error" })
      } else if (result.status === 409) {
        ElMessage({ message: "删除失败,有用户绑定当前角色", type: "error" })
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      })
    })
}

// 修改角色
const editLoading = ref<boolean>(true)
const editDialogVisible = ref<boolean>(false)
const editRoleFormRef = ref<FormInstance>()
const editBtnLoading = ref<boolean>(false)
// 修改表单
const editRoleForm = reactive({
  name: "",
  description: "",
  permissions: "",
})
type EditData = {
  name: string
  description: string
  permissions: string
}
// 修改角色id
const editRoleId = ref<number>(0)
// tree 默认展开的节点数组
const defaultExpandedKeys = ref<string[]>([])
// 显示修改表单
const handleEdit = async (id: number, data: EditData) => {
  editDialogVisible.value = true
  // editLoading.value = true
  editRoleId.value = id
  editRoleForm.name = data.name
  editRoleForm.description = data.description
  editRoleForm.permissions = data.permissions
  defaultExpandedKeys.value = data.permissions
    ? data.permissions.split(",")
    : []
  // console.log(defaultExpandedKeys.value)
  if (permissions.value.length) {
    editLoading.value = false
    return
  }
  const result = await getPermissionApi()
  if (result.success) {
    permissions.value = result.data
    editLoading.value = false
  }
}
// 选中的节点的 key 数组转为字符串
const setEditCheckedKeys = (obj: Tree, checkedInfo: CheckedInfo) => {
  editRoleForm.permissions = checkedInfo.checkedKeys.join(",")
}
const editCenael = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  editDialogVisible.value = false
}
const editSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        editBtnLoading.value = true
        const result = await updateRoleApi(editRoleId.value, editRoleForm)
        if (result.success) {
          formEl.resetFields()
          editDialogVisible.value = false
          editBtnLoading.value = false
          ElMessage({ message: "修改成功", type: "success" })
          await getRoles()
        } else if (result.status === 409) {
          editBtnLoading.value = false
          ElMessage({ message: "修改失败,角色名已存在", type: "error" })
        } else if (result.status === 401 && result.data.auth === 0) {
          ElMessage({ message: "修改失败,权限不足", type: "error" })
        }
      } finally {
        editBtnLoading.value = false
      }
    } else {
      console.log("error submit!", fields)
    }
  })
}
</script>

<style lang="stylus" scoped></style>
