<template>
    <div>
    <div :id="id" class="light">
        <div class="border border1"></div>
        <div class="border border2"></div>
        <div class="border border3"></div>
        <div class="border border4"></div>
        <div class="content" v-html="htmlContent"></div>
    </div>
    <div class="after"></div>
</div>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    id: {
        type: String,
        required: true
    },
    htmlContent: {
        type: String,
        required: true
    }
});
</script>
<style lang="scss" scoped>
.light {
    position: relative;
    padding: 4px;
    // color: #03e9f4;
    color: #ffffff;
    // font-size: 24px;
    text-transform: uppercase;
    transition: 0.5s;
    // letter-spacing: 4px;
    cursor: pointer;
    overflow: hidden;
    white-space: break-spaces;
    text-align: left;
    transform: translateY(-60px);

    .content {
        padding: 8px;
        background: #00b7b7a8;
    }
}


.after {
    position: absolute;
    display: block;
    content: '';
    // width: 2px;
    left: 50%;
    margin-top: 5px;
    // background-color: #0009;
    border: 2px dashed #03e9f4;
    height: 60px;
    pointer-events: none;
    z-index: auto;
    transform: translateY(-60px);
}

.light .border {
    position: absolute;
}

.light .border1 {
    width: 100%;
    height: 2px;
    top: 0;
    left: -100%;
    background: linear-gradient(to right, transparent, #03e9f4);
    animation: animate1 1s linear infinite;
}

.light .border2 {
    width: 2px;
    height: 100%;
    top: -100%;
    right: 0;
    background: linear-gradient(to bottom, transparent, #03e9f4);
    animation: animate2 1s linear infinite;
    animation-delay: 0.25s;
}

.light .border3 {
    width: 100%;
    height: 2px;
    bottom: 0;
    right: -100%;
    background: linear-gradient(to left, transparent, #03e9f4);
    animation: animate3 1s linear infinite;
    animation-delay: 0.5s;
}

.light .border4 {
    width: 2px;
    height: 100%;
    bottom: -100%;
    left: 0;
    background: linear-gradient(to top, transparent, #03e9f4);
    animation: animate4 1s linear infinite;
    animation-delay: 0.75s;
}

@keyframes animate1 {
    0% {
        left: -100%;
    }

    50%,
    100% {
        left: 100%;
    }
}

@keyframes animate2 {
    0% {
        top: -100%;
    }

    50%,
    100% {
        top: 100%;
    }
}

@keyframes animate3 {
    0% {
        right: -100%;
    }

    50%,
    100% {
        right: 100%;
    }
}

@keyframes animate4 {
    0% {
        bottom: -100%;
    }

    50%,
    100% {
        bottom: 100%;
    }
}
</style>