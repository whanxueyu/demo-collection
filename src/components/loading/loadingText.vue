<!--
 * @Author: anxueyu
 * @Date: 2024-09-03 13:54:35
 * @LastEditors: anxueyu 1358042645@qq.com
 * @LastEditTime: 2024-09-03 13:55:47
 * @FilePath: \demo-collection\src\components\loading\loadingText.vue
 * @Description: 
-->
<template>
    <p><slot></slot></p>
</template>

<script setup lang="ts">

</script>
<style lang="scss" scoped>
p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);  
    font-size: 6vw;
    line-height: 8vw;
}

p::after {
    content: "";
    position: absolute;
    top: 0%;
    bottom: 0;
    animation: dot 3s infinite steps(3, start);
    line-height: 9vw;
}

@keyframes dot {
    33.33% {
        content: ".";
    }
    66.67% {
        content: "..";
    }
    100% {
        content: "...";
    }
}
</style>