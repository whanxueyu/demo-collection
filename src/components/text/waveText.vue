<!--
 * @Author: anxueyu
 * @Date: 2024-09-03 14:07:44
 * @LastEditors: anxueyu 1358042645@qq.com
 * @LastEditTime: 2024-09-03 14:11:20
 * @FilePath: \demo-collection\src\components\text\waveText.vue
 * @Description: 
-->
<template>
    <div class="g-container">
    <p>TEXT WAVE</p>
</div>
</template>

<script setup lang="ts">

</script>
<style lang="scss" scoped>
html, body {
    width: 100%;
    height: 100%;
    display: flex;
}

.g-container {
    margin: auto;
}

p {
    position: relative;
    font-size: 120px;
    font-weight: bold;
    background: #fff;
    color: #000;
    overflow: hidden;
    
    &::before,
    &::after {
        content: "";
        position: absolute;
        top: -923px;
        left: 50%;
        width: 2000px;
        height: 2000px;
        border-radius: 45% 48% 43% 47%;
        transform: translate(-50%, -50%);
        background: rgba(3, 169, 244, .85);
        animation: rotate 10s infinite linear;
        z-index: 1;
        mix-blend-mode: lighten;
    }
    
    &::after {
        border-radius: 43% 47% 44% 48%;
        animation: rotate 10s infinite .5s linear;
    }
}

@keyframes rotate {
    0% {
        transform: translate(-50%, -50%) rotate(0);
    }
    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
</style>