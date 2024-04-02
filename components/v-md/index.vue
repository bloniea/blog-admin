<template>
  <MdEditor theme="dark" v-model="text" style="width: 100%" />
</template>

<script lang="ts" setup>
import { MdEditor } from "md-editor-v3"
import "md-editor-v3/lib/style.css"
const props = defineProps({
  value: {
    type: String,
    default: "",
  },
})
const text = ref(props.value)
</script>

<style lang="stylus" scoped>
.md
  width 100%
</style>
