<!--
 * @Author: anxueyu
 * @Date: 2024-09-03 15:33:32
 * @LastEditors: anxueyu 1358042645@qq.com
 * @LastEditTime: 2024-09-03 19:25:58
 * @FilePath: \demo-collection\src\components\text\svgText2.vue
 * @Description: 
-->
<template>
    <svg viewBox="0 0 400 200">
        <text x="0" y="70%"> Lorem </text>
    </svg>
</template>
<script setup lang="ts">
import { defineProps, ref } from 'vue';
const props = defineProps({
    text: {
        type: String,
        default: 'TEXT'
    }
})
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Bangers&family=Homemade+Apple&family=Sacramento&display=swap");

html,
body {
    width: 100%;
    height: 100%;
    display: flex;
    font-family: "Bangers", cursive;
    background: #000;
}

svg {
    width: 1005;
    height: 300px;
    margin: auto;
}

svg text {
    text-transform: uppercase;
    animation: stroke 5s infinite alternate;
    letter-spacing: 10px;
    font-size: 150px;
}

@keyframes stroke {
    0% {
        fill: rgba(72, 138, 20, 0);
        stroke: rgba(54, 95, 160, 1);
        stroke-dashoffset: 25%;
        stroke-dasharray: 0 50%;
        stroke-width: 0.8;
    }

    50% {
        fill: rgba(72, 138, 20, 0);
        stroke: rgba(54, 95, 160, 1);
        stroke-width: 1.2;
    }

    70% {
        fill: rgba(72, 138, 20, 0);
        stroke: rgba(54, 95, 160, 1);
        stroke-width: 1.5;
    }

    90%,
    100% {
        fill: rgba(72, 138, 204, 1);
        stroke: rgba(54, 95, 160, 0);
        stroke-dashoffset: -25%;
        stroke-dasharray: 50% 0;
        stroke-width: 0;
    }
}
</style>