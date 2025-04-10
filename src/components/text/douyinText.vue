<!--
 * @Author: anxueyu
 * @Date: 2024-09-03 14:07:44
 * @LastEditors: anxueyu 1358042645@qq.com
 * @LastEditTime: 2024-09-03 14:09:07
 * @FilePath: \demo-collection\src\components\text\douyinText.vue
 * @Description: 
-->
<template>
    <div class="text-magic" :data-word="props.text">
        <div class="white"></div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    text: {
        type: String,
        default: 'DouYin',
    }
})
</script>
<style lang="scss" scoped>
.text-magic {
    height: 56px;
    transform: translate(0%, 0%);
    width: 240px;
    font-size: 36px;
    font-family: Raleway, Verdana, Arial;
    color: transparent;
}

.white {
    position: absolute;
    left: -10px;
    width: 100%;
    height: 1px;
    background: #000;
    z-index: 4;
    animation: whiteMove 10s ease-out infinite;
}

.text-magic::before {
    content: attr(data-word);
    position: absolute;
    top: 0;
    left: 0;
    height: 56px;
    color: red;
    overflow: hidden;
    z-index: 2;
    filter: contrast(200%);
    text-shadow: 1px 0 0 red;
    animation: move 0.95s infinite;
}

.text-magic::after {
    content: attr(data-word);
    position: absolute;
    top: 0;
    left: -1px;
    height: 56px;
    color: rgba(255, 255, 255, 0.8);
    overflow: hidden;
    z-index: 3;
    color: cyan;
    filter: contrast(200%);
    text-shadow: -1px 0 0 cyan;
    mix-blend-mode: lighten;
    animation: move 1.1s infinite 0.2s;
}

@keyframes whiteMove {
    9% {
        top: 38px;
    }

    14% {
        top: 8px;
    }

    18% {
        top: 42px;
    }

    22% {
        top: 1px;
    }

    32% {
        top: 32px;
    }

    34% {
        top: 12px;
    }

    40% {
        top: 26px;
    }

    43% {
        top: 7px;
    }

    99% {
        top: 30px;
    }
}

@keyframes move {
    10% {
        top: -0.4px;
        left: -1.1px;
    }

    20% {
        top: 0.4px;
        left: -0.2px;
    }

    30% {
        left: .5px;
    }

    40% {
        top: -0.3px;
        left: -0.7px;
    }

    50% {
        left: 0.2px;
    }

    60% {
        top: 1.8px;
        left: -1.2px;
    }

    70% {
        top: -1px;
        left: 0.1px;
    }

    80% {
        top: -0.4px;
        left: -0.9px;
    }

    90% {
        left: 1.2px;
    }

    100% {
        left: -1.2px;
    }
}
</style>