<template>
  <div></div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router"
const route = useRoute(),
  router = useRouter()

// Redirect to /home if the current path is /

if (route.path === "/") {
  router.push("/dashboard")
}
</script>
