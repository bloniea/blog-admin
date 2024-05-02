<template>
  <div class="atticle-add">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/article' }"
        >文章管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>添加文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form
        label-position="right"
        label-width="auto"
        :rules="rules"
        :model="addForm"
        v-loading="loading"
        ref="formRef"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" />
        </el-form-item>
        <el-form-item label="分类" prop="category_id">
          <el-select
            v-model="addForm.category_id"
            placeholder="Select"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in categories"
              :key="item.category_id"
              :label="item.name"
              :value="item.category_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片地址" prop="img_url">
          <el-input v-model="addForm.img_url" />
        </el-form-item>
        <el-form-item label="预览">
          <el-image :src="addForm.img_url"></el-image>
        </el-form-item>
        <el-form-item label="图片来源" prop="img_source">
          <el-input v-model="addForm.img_source" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <v-md v-model="addForm.content" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm(formRef)"
            v-loading="btnLoading"
          >
            创建
          </el-button>
          <el-button @click="resetForm(formRef)">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
// import { reactive } from "vue"
import type { FormInstance, FormRules } from "element-plus"

interface Category {
  name: string
  category_id: string
}
const categories = ref<Category[]>([])
const loading = ref<boolean>(true)
const formRef = ref<FormInstance>()
interface AddForm {
  title: string
  category_id: string
  img_url: string
  img_source: string
  content: string
}
const rules = reactive<FormRules<AddForm>>({
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  category_id: [{ required: true, message: "请选择分类", trigger: "change" }],
  img_url: [{ required: true, message: "请输入图片地址", trigger: "blur" }],
  img_source: [{ required: true, message: "请输入图片来源", trigger: "blur" }],
  content: [{ required: true, message: "请输入文章内容", trigger: "blur" }],
})
const getCategorys = async () => {
  loading.value = true
  const res = await getCategoriesApi()
  if (res.success) {
    categories.value = res.data.result
    loading.value = false
  }
}
getCategorys()
const addForm = reactive({
  title: "",
  category_id: "",
  img_url: "",
  img_source: "",
  content: "",
})
const btnLoading = ref<boolean>(false)
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        btnLoading.value = true
        const res = await addArticleApi(addForm)
        if (res.success) {
          ElMessage.success("添加成功")
          resetForm(formEl)
          navigateTo("/article")
        } else if (res.status === 404) {
          ElMessage.error("创建失败,分类不存在")
        } else if (res.status === 401 && res.data.auth === 0) {
          ElMessage.error("创建失败,权限不足")
        }
      } finally {
        btnLoading.value = false
      }
    } else {
      console.error("error submit!!")
    }
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style lang="stylus" scoped></style>
