<template>
  <div class="edit-article">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/article' }"
        >文章管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>修改文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form
        label-position="right"
        label-width="auto"
        :rules="rules"
        :model="editForm"
        v-loading="loading"
        ref="formRef"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="分类" prop="category_id">
          <el-select
            v-model="editForm.category_id"
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
          <el-input v-model="editForm.img_url" />
        </el-form-item>
        <el-form-item label="预览">
          <el-image :src="editForm.img_url"></el-image>
        </el-form-item>
        <el-form-item label="图片来源" prop="img_source">
          <el-input v-model="editForm.img_source" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <v-md v-model="editForm.content" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm(formRef)"
            v-loading="btnLoading"
          >
            修改
          </el-button>
          <el-button @click="resetForm(formRef)">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
interface Category {
  name: string
  category_id: number
}
const categories = ref<Category[]>([])
const getCategorys = async () => {
  loading.value = true
  const res = await getCategoriesApi()
  if (res.success) {
    categories.value = res.data.result
    loading.value = false
  }
}
const formRef = ref<FormInstance>()
interface EditForm {
  title: string
  category_id: string
  img_url: string
  img_source: string
  content: string
}
const rules = reactive<FormRules<EditForm>>({
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  category_id: [{ required: true, message: "请选择分类", trigger: "change" }],
  img_url: [{ required: true, message: "请输入图片地址", trigger: "blur" }],
  img_source: [{ required: true, message: "请输入图片来源", trigger: "blur" }],
  content: [{ required: true, message: "请输入文章内容", trigger: "blur" }],
})
const route = useRoute()
interface Article {
  title: string
  category_id: string
  img_url: string
  img_source: string
  content: string
}
const editForm = reactive<Article>({
  title: "",
  category_id: "",
  img_url: "",
  img_source: "",
  content: "",
})
const btnLoading = ref<boolean>(false)
const loading = ref<boolean>(true)
const getArticle = async () => {
  const articleId = route.params.id as string
  loading.value = true
  const res = await getArticleApi(articleId)
  if (res.success) {
    await getCategorys()
    loading.value = false
    editForm.title = res.data.title
    editForm.category_id = res.data.category_id
    editForm.img_url = res.data.img_url
    editForm.img_source = res.data.img_source
    editForm.content = res.data.content
  } else {
    navigateTo("/article")
  }
}
getArticle()

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        btnLoading.value = true
        const articleId = route.params.id as string

        const res = await updateArticleApi(articleId, editForm)
        if (res.success) {
          ElMessage.success("修改成功")
          resetForm(formEl)
          navigateTo("/article")
        } else if (res.status === 404) {
          ElMessage.error("修改失败,文章不存在")
        } else if (res.status === 401 && res.data.auth === 0) {
          ElMessage.error("修改失败,权限不足")
        }
      } finally {
        btnLoading.value = false
      }
    } else {
      console.error("error submit!!")
    }
  })
}
</script>

<style lang="stylus" scoped></style>
