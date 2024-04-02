<template>
  <div class="aside">
    <el-menu
      :default-active="defaultActive"
      @open="handleOpen"
      @close="handleClose"
      class="el-menu-demo"
      router
    >
      <el-menu-item-group v-for="item in list">
        <el-sub-menu :index="item.index" v-if="item.children.length">
          <template #title
            ><el-icon><component :is="item.icon" /></el-icon
            >{{ item.title }}</template
          >
          <el-menu-item
            v-for="l in item.children"
            :index="l.index"
            :route="l.path"
            >{{ l.title }}</el-menu-item
          >
        </el-sub-menu>
        <el-menu-item :index="item.index" v-else :route="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import {
  HomeFilled,
  Menu as IconMenu,
  User,
  Setting,
  FolderOpened,
  Document,
} from "@element-plus/icons-vue"

const list = [
  {
    title: "主页",
    icon: HomeFilled,
    path: "/dashboard",
    index: "1",
    children: [] as any,
  },
  {
    title: "用户管理",
    icon: User,
    path: "/user",
    index: "2",
    children: [] as any,
  },
  {
    title: "角色管理",
    icon: Setting,
    path: "/role",
    index: "3",
    children: [] as any,
  },
  {
    title: "分类管理",
    icon: FolderOpened,
    path: "/category",
    index: "4",
    children: [] as any,
  },
  {
    title: "文章管理",
    icon: Document,
    path: "/article",
    index: "5",
    children: [] as any,
  },
]
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const defaultActive = computed(() => {
  const router = useRouter()
  const path = router.currentRoute.value.path
  switch (path) {
    case "/dashboard":
      return "1"
    case "/user":
      return "2"
    case "/role":
      return "3"
    case "/category":
      return "4"
    case "/article":
      return "5"
    default:
      return "1"
  }
})
</script>

<style lang="stylus" scoped>
.aside
  :deep(ul)
    height 100%
</style>
