<template>
  <div class="layout-login">
    <NuxtPage>
      <slot name="login" />
    </NuxtPage>
    <MyFooter />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="stylus" scoped>
.layout-login
  display flex
  flex-direction column
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
</style>
