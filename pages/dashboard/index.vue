<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>主页</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card v-loading="loading">
      <el-row>
        <el-col :span="6">
          <el-statistic title="Number of users" :value="info.users" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="Number of roles" :value="info.roles" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="Number of categories" :value="info.categories" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="Number of articles" :value="info.articles" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
interface Info {
  articles: number
  categories: number
  roles: number
  users: number
}
const info = reactive<Info>({
  articles: 0,
  categories: 0,
  roles: 0,
  users: 0,
})
const loading = ref<boolean>(true)
const getInfo = async () => {
  loading.value = true
  const res = await getInfoApi()
  if (res.success) {
    loading.value = false
    info.articles = Number(res.data.articles)
    info.categories = Number(res.data.categories)
    info.roles = Number(res.data.roles)
    info.users = Number(res.data.users)
  }
}
onMounted(() => {
  getInfo()
})
</script>

<style lang="stylus" scoped></style>
