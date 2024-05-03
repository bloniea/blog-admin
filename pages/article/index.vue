<template>
  <div class="article">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
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
            @keyup.enter="getArticles"
            @change="getAllArticles"
          ></el-input>

          <el-button class="add-btn" @click="showAddForm"> 添加文章</el-button>
        </div>
      </template>
      <div class="table-da" v-loading="loading">
        <el-table :data="data" stripe style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column
            prop="title"
            label="标题"
            width="300"
          ></el-table-column>
          <el-table-column
            prop="categorytitle"
            label="分类"
            width="200"
          ></el-table-column>
          <el-table-column prop="img_url" label="图片" width="200">
            <template #default="scope">
              <el-image :src="scope.row.img_url"></el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="img_source"
            label="图片来源"
            width="200"
          ></el-table-column>
          <el-table-column prop="created_at" label="时间">
            <template #default="scope">
              <div>{{ getDate(scope.row.created_at) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row.article_id)"
                >Edit</el-button
              >
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row.article_id)"
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
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { Search } from "@element-plus/icons-vue"

const query = reactive({
  keyword: "",
  pages: 10,
  pageNumber: 1,
})
interface Article {
  article_id: number
  title: string
  content: string
  img_url: string
  img_source: string
  category_id: number
  created_at: string
  categorytitle: string
}
const data = ref<Article[]>([])
const loading = ref<boolean>(true)
const getArticles = async () => {
  loading.value = true
  const res = await getArticlesApi(query)
  data.value = res.data.result
  total.value = parseInt(res.data.total)
  loading.value = false
}
onMounted(() => {
  getArticles()
})

const getAllArticles = async () => {
  if (!query.keyword) getArticles()
}
const total = ref<number>(0)
// 每页显示数量改变
const handleSizeChange = async (val: number) => {
  query.pages = val
  query.pageNumber = 1
  await getArticles()
}

// 页码改变
const handleCurrentChange = async (val: number) => {
  query.pageNumber = val
  await getArticles()
}
// 添加
const showAddForm = async () => {
  navigateTo("/article/add")
}
const handleEdit = async (id: number) => {
  navigateTo(`/article/edit/${id}`)
}

const handleDelete = async (id: number) => {
  ElMessageBox.confirm("此操作将永久删除该文章, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const message = ElMessage({
      message: "正在删除...",
      type: "info",
      duration: 0,
    })
    const res = await deleteArticleApi(id)
    message.close()
    if (res.success) {
      ElMessage.success("删除成功")
      return await getArticles()
    } else if (res.status === 404) {
      ElMessage.error("删除失败,文章不存在")
    } else if (res.status === 401 && res.data.auth === 0) {
      ElMessage.error("删除失败,权限不足")
    }
  })
}
</script>

<style lang="stylus" scoped></style>
