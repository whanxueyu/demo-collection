<!--
 * @Author: anxueyu
 * @Date: 2024-09-03 13:56:29
 * @LastEditors: anxueyu 1358042645@qq.com
 * @LastEditTime: 2024-09-03 13:57:47
 * @FilePath: \demo-collection\src\components\loading\loadingCircle.vue
 * @Description: 
-->
<template>
    <div></div>
    <div class="color"></div>
</template>

<script setup lang="ts">

</script>
<style lang="scss" scoped>
body,
html {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
}

div {
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: auto;
    transform: rotate(360deg);
    animation: rotate 45s infinite linear;
}

div::before {
    position: absolute;
    content: "";
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    box-sizing: border-box;
    border-radius: 50%;
    border-top: 3px solid #000;
    border-left: 3px solid #000;
    border-bottom: 3px solid transparent;
    border-right: 3px solid transparent;
    transform: rotate(720deg);
    animation: rotate 3s infinite ease-out;
}

div::after {
    position: absolute;
    content: "";
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    box-sizing: border-box;
    border-radius: 50%;
    border-bottom: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid #fff;
    border-left: 7px solid #fff;
    transform: rotate(720deg);
    animation: rotate 3s infinite ease-in-out;
}

@keyframes rotate {
    100% {
        transform: rotate(0deg);
    }
}

.color::after {
    position: absolute;
    content: "";
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    box-sizing: border-box;
    border-radius: 50%;
    border-bottom: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid rgba(255, 0, 0, .8);
    border-left: 7px solid rgba(255, 0, 0, .8);
    transform: rotate(720deg);
    animation: rotate 3s infinite ease-in-out;
}
</style>