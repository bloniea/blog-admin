<template>
  <div class="pagination">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[2, 10, 20, 30]"
      small
      :background="false"
      layout="sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
const prop = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: { type: Number, default: 10 },
  total: { type: Number, default: 0 },
  handleSizeChange: Function,
  handleCurrentChange: Function,
})
const currentPage = ref<number>(prop.currentPage)
const pageSize = ref<number>(prop.pageSize)
const emits = defineEmits(["handleSizeChange", "handleCurrentChange"])
const handleSizeChange = async (page: number) => {
  emits("handleSizeChange", page)
}
const handleCurrentChange = async (page: number) => {
  emits("handleCurrentChange", page)
}
</script>

<style lang="stylus" scoped></style>
