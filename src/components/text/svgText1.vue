<!--
 * @Author: anxueyu
 * @Date: 2024-09-03 15:33:32
 * @LastEditors: anxueyu 1358042645@qq.com
 * @LastEditTime: 2024-09-03 19:27:27
 * @FilePath: \demo-collection\src\components\text\svgText1.vue
 * @Description: 
-->
<template>
    <div>
        <svg viewBox="0 0 280 172">
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
    </div>
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

svg {
    margin: auto;
    width: 280px;
    height: 172px;
    font-size: 100px;
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