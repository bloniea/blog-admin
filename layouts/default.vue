<template>
  <el-container class="layout">
    <el-container class="my-container">
      <el-header>
        <MyHeader></MyHeader>
      </el-header>
      <el-container>
        <el-aside width="200px" class="">
          <MyAside></MyAside>
        </el-aside>
        <el-container class="relative">
          <el-main>
            <NuxtPage> <slot></slot> </NuxtPage
          ></el-main>
          <el-footer class="">
            <MyFooter></MyFooter>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang="ts"></script>

<style lang="stylus" scoped>
.layout
  width 100%
  height 100%
  background-color rgba(0,0,0,0.66)
  position relative
  :deep(.search){
    margin-right 20px
    }

  .aside
    height 100%
  .my-container
    width 100%
    height 100%
    display flex
</style>
