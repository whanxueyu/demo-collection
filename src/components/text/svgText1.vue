<!--
 * @Author: anxueyu
 * @Date: 2024-09-03 15:33:32
 * @LastEditors: anxueyu 1358042645@qq.com
 * @LastEditTime: 2024-09-03 15:34:12
 * @FilePath: \demo-collection\src\components\text\svgText1.vue
 * @Description: 
-->
<template>
    <svg viewBox="0 0 800 600">
        <symbol id="s-text">
            <text text-anchor="middle" x="50%" y="35%" class="text--line">Swing</text>
            <text text-anchor="middle" x="50%" y="68%" class="text--line2">Text</text>
        </symbol>
        <g class="g-ants">
            <use xlink:href="#s-text" class="text-copy"></use>
            <use xlink:href="#s-text" class="text-copy"></use>
            <use xlink:href="#s-text" class="text-copy"></use>
            <use xlink:href="#s-text" class="text-copy"></use>
            <use xlink:href="#s-text" class="text-copy"></use>
        </g>
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
body {
    background: #000;
    background-size: .12em 100%;
    font: 16em/1 Arial;
}

.text--line {
    font-size: .5em;
}

svg {
    position: absolute;
    width: 100%;
    height: 100%;
}

.text-copy {
    fill: none;
    stroke: white;
    stroke-dasharray: 7% 28%;
    stroke-width: 3px;
    -webkit-animation: stroke-offset 9s infinite linear;
    animation: stroke-offset 9s infinite linear;
}

.text-copy:nth-child(1) {
    stroke: #360745;
    stroke-dashoffset: 7%;
}

.text-copy:nth-child(2) {
    stroke: #D61C59;
    stroke-dashoffset: 14%;
}

.text-copy:nth-child(3) {
    stroke: #E7D84B;
    stroke-dashoffset: 21%;
}

.text-copy:nth-child(4) {
    stroke: #EFEAC5;
    stroke-dashoffset: 28%;
}

.text-copy:nth-child(5) {
    stroke: #1B8798;
    stroke-dashoffset: 35%;
}

@-webkit-keyframes stroke-offset {
    50% {
        stroke-dashoffset: 35%;
        stroke-dasharray: 0 87.5%;
    }
}

@keyframes stroke-offset {
    50% {
        stroke-dashoffset: 35%;
        stroke-dasharray: 0 87.5%;
    }
}
</style>