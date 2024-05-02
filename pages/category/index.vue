<template>
  <div class="cateogry">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>主页</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <template #header>
        <div class="card-header">
          <el-input
            v-model="query.keyword"
            style="width: 240px"
            placeholder="请输入角色名"
            clearable
            :prefix-icon="Search"
            class="search"
            @keyup.enter="getCategories"
            @change="getAllCategories"
          ></el-input>

          <el-button class="add-btn" @click="showAddForm"> 添加分类</el-button>
        </div>
      </template>
      <div class="table-da" v-loading="loading">
        <el-table :data="data" stripe style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column
            prop="name"
            label="名字"
            width="200"
          ></el-table-column>
          <el-table-column prop="img_url" label="图片" width="300">
            <template #default="scope">
              <el-image :src="scope.row.img_url"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="时间">
            <template #default="scope">
              <div>{{ getDate(scope.row.created_at) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                size="small"
                @click="handleEdit(scope.row.category_id, scope.row)"
                >Edit</el-button
              >
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row.category_id)"
                >Delete</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :currentPage="query.pageNumber"
          :pageSize="query.pages"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          :total="total"
        />
      </div>
    </el-card>

    <el-dialog
      class="add-dialog"
      v-model="addDialogVisible"
      destroy-on-close
      :close-on-click-modal="false"
      title="添加分类"
      width="40%"
      @close="addCenael(addCategoryFormRef)"
    >
      <div>
        <el-form
          :model="AddForm"
          :rules="rules"
          ref="addCategoryFormRef"
          label-width="auto"
        >
          <el-form-item label="分类名字" prop="name">
            <el-input v-model="AddForm.name"></el-input>
          </el-form-item>
          <el-form-item label="图片地址" prop="img_url">
            <el-input v-model="AddForm.img_url"></el-input>
          </el-form-item>
          <el-form-item label="预览">
            <el-image :src="AddForm.img_url"></el-image>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addCenael(addCategoryFormRef)">取消</el-button>
          <el-button
            type="primary"
            @click="addSubmit(addCategoryFormRef)"
            :loading="addBtnLoading"
          >
            添加
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog
      class="add-dialog"
      v-model="editDialogVisible"
      destroy-on-close
      :close-on-click-modal="false"
      title="修改分类"
      width="40%"
      @close="editCenael(editCategoryFormRef)"
    >
      <div>
        <el-form
          :model="editForm"
          :rules="rules"
          ref="editCategoryFormRef"
          label-width="auto"
        >
          <el-form-item label="分类名字" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="图片地址" prop="img_url">
            <el-input v-model="editForm.img_url"></el-input>
          </el-form-item>
          <el-form-item label="预览">
            <el-image :src="editForm.img_url"></el-image>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editCenael(editCategoryFormRef)">取消</el-button>
          <el-button
            type="primary"
            @click="editSubmit(editCategoryFormRef)"
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

const loading = ref<boolean>(true)
interface Category {
  name: string
  category_id: number
  img_url: string
  created_at: string
}
const query = reactive({
  keyword: "",
  pages: 10,
  pageNumber: 1,
})
const total = ref<number>(0)
const data = ref<Category[]>([])
const getCategories = async () => {
  loading.value = true
  const res = await getCategoriesApi(query)
  loading.value = false
  data.value = res.data.result
  total.value = parseInt(res.data.total)
}
getCategories()

const getAllCategories = async () => {
  if (!query.keyword) {
    query.pageNumber = 1
    query.pages = 10
    await getCategories()
  }
}
const handleSizeChange = async (page: number) => {
  query.pages = page
  await getCategories()
}
const handleCurrentChange = async (page: number) => {
  query.pageNumber = page
  await getCategories()
}
// 添加分类
const addDialogVisible = ref<boolean>(false)
const addCategoryFormRef = ref<FormInstance>()
const addBtnLoading = ref<boolean>(false)
const AddForm = reactive({
  name: "",
  img_url: "",
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入分类名", trigger: "blur" }],
  img_url: [{ required: true, message: "请输入图片地址", trigger: "blur" }],
})
const showAddForm = async () => {
  addDialogVisible.value = true
}
const addSubmit = async (formRef: FormInstance | undefined) => {
  if (!formRef) return

  await formRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        addBtnLoading.value = true
        const res = await addCategoryApi(AddForm)

        if (res.success) {
          addDialogVisible.value = false
          ElMessage.success("添加成功")
          return await getCategories()
        } else if (res.status === 409) {
          ElMessage.error("添加失败分类名已存在")
        } else if (res.status === 401 && res.data.auth === 0) {
          ElMessage.error("修改失败,权限不足")
        }
      } finally {
        addBtnLoading.value = false
      }
    } else {
      console.log("error submit!", fields)
    }
  })
}
const addCenael = async (formRef: FormInstance | undefined) => {
  if (!formRef) return
  formRef.resetFields()
  addDialogVisible.value = false
}

// 修改分类
const editDialogVisible = ref<boolean>(false)
const editCategoryFormRef = ref<FormInstance>()
const categoryId = ref<number>(0)
const editBtnLoading = ref<boolean>(false)
const handleEdit = async (id: number, data: Category) => {
  categoryId.value = id
  editForm.name = data.name
  editForm.img_url = data.img_url
  editDialogVisible.value = true
}
const editForm = reactive({
  name: "",
  img_url: "",
})
const editCenael = async (formRef: FormInstance | undefined) => {
  if (!formRef) return
  formRef.resetFields()
  editDialogVisible.value = false
}
const editSubmit = async (formRef: FormInstance | undefined) => {
  if (!formRef) return
  await formRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        addBtnLoading.value = true
        const res = await editCategoryApi(categoryId.value, editForm)
        if (res.success) {
          editDialogVisible.value = false
          ElMessage.success("修改成功")
          return await getCategories()
        } else if (res.status === 409) {
          ElMessage.error("修改失败分类名已存在")
        } else if (res.status === 401 && res.data.auth === 0) {
          ElMessage.error("修改失败,权限不足")
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
  ElMessageBox.confirm(
    "此操作将永久删除该分类和该分类的文章, 是否继续?",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(async () => {
    const message = ElMessage({
      message: "正在删除...",
      type: "info",
      duration: 0,
    })
    const res = await deleteCategoryApi(id)
    message.close()
    if (res.success) {
      ElMessage.success("删除成功")
      return await getCategories()
    } else if (res.status === 404) {
      ElMessage.error("删除失败,分类不存在")
    } else if (res.status === 401 && res.data.auth === 0) {
      ElMessage.error("删除失败,权限不足")
    }
  })
}
</script>

<style lang="stylus" scoped></style>
