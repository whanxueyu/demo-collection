<!--
 * @Author: anxueyu
 * @Date: 2024-09-03 14:01:07
 * @LastEditors: anxueyu 1358042645@qq.com
 * @LastEditTime: 2024-09-03 14:01:50
 * @FilePath: \demo-collection\src\components\img\errorImg.vue
 * @Description: 
-->
<template>
    <div class="mix3d"></div>
</template>

<script setup lang="ts">

</script>
<style lang="scss" scoped>
.mix3d {
    margin: 30px auto 0;
    width: 400px;
    height: 400px;
    z-index: 2;
    background: url('https://yyb.gtimg.com/aiplat/page/product/visionimgidy/img/demo6-16a47e5d31.jpg?max_age=31536000'), cyan;
    background-blend-mode: lighten;
    background-size: center;

  &:after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    z-index: 3;
    background: url('https://yyb.gtimg.com/aiplat/page/product/visionimgidy/img/demo6-16a47e5d31.jpg?max_age=31536000'), red;
    background-blend-mode: lighten;
    margin-left: 10px;
    background-size: center;
    mix-blend-mode: darken;
  }
}
</style>