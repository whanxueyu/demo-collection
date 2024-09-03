<!--
 * @Author: anxueyu
 * @Date: 2024-09-03 13:56:29
 * @LastEditors: anxueyu 1358042645@qq.com
 * @LastEditTime: 2024-09-03 14:06:58
 * @FilePath: \demo-collection\src\components\loading\loadingRoate.vue
 * @Description: 
-->
<template>
    <strong class="loading">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
</strong>
</template>

<script setup lang="ts">

</script>
<style lang="scss" scoped>
body {
    background:#291f34;
    overflow:hidden;
}

.loading {
    position:absolute;
    left:50%;
    top:30vh;
    margin-left:-20vh;
    display:block;
    width:40vh;
    height:40vh;
    text-align:center;
    filter:contrast(1.2);
    
    span {
          mix-blend-mode:screen;
        display:block;
        position:absolute;
        border-radius:50%;
        animation:wave 3s infinite linear;
    }
    
    span:nth-child(0) {
        left:-11%;
        right:-2%;
        top:-12%;
        bottom:-5%;
        transform-origin:46% 53%;
        animation-delay:0;
        background-color:hsl(0, 50%, 50%);
    }
    
    span:nth-child(1) {
        left:-4%;
        right:-4%;
        top:-9%;
        bottom:-2%;
        transform-origin:47% 50%;
        animation-delay:-1s;
        background-color:hsl(50, 60%, 50%);
    }
    
    span:nth-child(2) {
        left:-11%;
        right:-4%;
        top:-10%;
        bottom:-11%;
        transform-origin:49% 53%;
        animation-delay:-1.5s;
        background-color:hsl(100, 70%, 50%);
    }
    
    span:nth-child(3) {
        left:-7%;
        right:-9%;
        top:-11%;
        bottom:-4%;
        transform-origin:47% 52%;
        animation-delay:-2s;
        background-color:hsl(150, 80%, 50%);
    }
    
    span:nth-child(4) {
        left:-8%;
        right:-3%;
        top:-5%;
        bottom:-11%;
        transform-origin:47% 52%;
        animation-delay:-2.5s;
        background-color:hsl(200, 90%, 50%);
    }
    
    span:nth-child(5) {
        left:-10%;
        right:-8%;
        top:-4%;
        bottom:-9%;
        transform-origin:48% 51%;
        animation-delay:-3s;
        background-color:hsl(250, 100%, 50%);
    }
    
    span:nth-child(6) {
        left:-9%;
        right:-11%;
        top:-5%;
        bottom:-8%;
        transform-origin:47% 50%;
        animation-delay:-3.5s;
        background-color:hsl(300, 100%, 50%);
    }
}

@keyframes wave {
    from {
        transform:rotateZ(0deg);
    }
    to {
        transform:rotateZ(360deg);
    }
}
</style>