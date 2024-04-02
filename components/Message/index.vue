<template>
  <div class="message container mx-auto position">
    <div class="value bg-purple-800">Congrats, this is a success message</div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="stylus" scoped>
.message
    font-size 12px
    color #fff
    text-align center
    padding 30px 0
    width 100%
    z-index 100
    display flex
    justify-content center
    .value
        background-color bg-purple-600
        padding 10px 20px
        border-radius 5px
        box-shadow 0 0 10px rgba(0, 0, 0, 0.1)
        color #fff
        font-size 14px
        font-weight 500
        text-align center
        display inline-block
        margin-top 10px
        margin-bottom 10px
        position relative
</style>
