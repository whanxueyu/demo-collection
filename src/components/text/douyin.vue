<!--
 * @Author: anxueyu
 * @Date: 2024-09-03 13:44:09
 * @LastEditors: anxueyu 1358042645@qq.com
 * @LastEditTime: 2024-09-03 13:45:18
 * @FilePath: \demo-collection\src\components\text\douyin.vue
 * @Description: 
-->
<template>
    <div class="cp-douyin">
        <div class="douyin">
        </div>
    </div>
</template>

<script setup lang="ts">

defineOptions({
    name: 'CpGlowText',
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.cp-douyin{
    width: 318px;
    height: 348px;
    padding-top: 30px;
}
.douyin {
    position: relative;
    width: 37px;
    height: 218px;
    margin: 30px 100px 100px 170px;
    z-index: 1;
    background: #fff;
    filter:drop-shadow(-10px -10px 0 #24f6f0) contrast(150%) brightness(110%);
    box-shadow: 11.6px 10px 0 0 #fe2d52;
    z-index: 10;
    // transform: skewX(-5deg);
    animation: move 5s infinite ease-in;
    
    &::before {
        content: "";
        position: absolute;
        width: 100px;
        height: 100px;
        border: 37px solid #fff;
        border-top: 37px solid transparent;
        border-radius: 50%;
        top: 123px;
        left: -137px;
        transform: rotate(45deg);
        filter: drop-shadow(16px 0px 0 #fe2d52);
        // mix-blend-mode: overlay;
    }
    
        &::after {
        content: "";
        position: absolute;
        width: 140px;
        height: 140px;
        border: 30px solid #fff;
        border-right: 30px solid transparent;
        border-top: 30px solid transparent;
        border-left: 30px solid transparent;
        top: -100px;
        right: -172px;
        border-radius: 100%;
        transform: rotate(45deg);
        z-index: -10;
        filter:drop-shadow(14px 0 0 #fe2d52);
    }
}

@keyframes move {
    4% {
        transform: skewX(7deg) translate(-30px);
    }
    7% {
        transform: skewX(-6deg) translate(18px);
    }
    9% {
        transform: skewX(5deg) translate(-8px);
    }
    10% {
        transform: skewX(-4deg)translate(6px);
    }
    11% {
        transform: skewX(3deg)translate(-4px);
    }
    12% {
        transform: skewX(-2deg) translate(2px);
    }
    13% {
        transform: skewX(1deg) translate(0px);
        filter:drop-shadow(-10px -10px 0 #24f6f0) contrast(120%) brightness(110%) blur(3px);
    }
    30% {
        filter:drop-shadow(-10px -10px 0 #24f6f0) contrast(150%) brightness(120%) blur(0px);
    }
}
</style>