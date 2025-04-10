<template>
    <div :class="['cp-svg-btn', 'svg-' + props.type, props.size]">
        <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <rect class="outline" height="100%" width="100%" />
        </svg>
        <div class="text">
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
import { defineProps, ref } from 'vue';
const props = defineProps({
    type: {
        type: String,
        default: '1'
    },
    size: {
        type: String,
        default: 'default'
    }
})
</script>
<style lang="scss" scoped>
$default: #ffcc00;
$pink: deeppink;

@keyframes woop {
    0% {
        stroke-dasharray: 50 600;
        stroke-dashoffset: -550;
    }

    40%,
    50% {
        stroke-dasharray: 50 600;
        stroke-dashoffset: -250;
    }

    100% {
        stroke-dasharray: 600 0;
        stroke-dashoffset: 25;
    }
}

@keyframes bounceRight {
    0% {
        transform: translateX(-100%);
    }

    30% {
        transform: translateX(-100%);
    }

    40%,
    60%,
    80%,
    100% {
        transform: translateX(0);
    }

    50% {
        transform: translateX(-30%);
    }

    70% {
        transform: translateX(-15%);
    }

    90% {
        transform: translateX(-7.5%);
    }
}

html {
    text-align: center;
    color: $default;

    *,
    *:before,
    *:after {
        transition: 1s;
        box-sizing: border-box;
    }
}

.large {
    height: 50px;
    margin: 6px 12px;
    width: 200px;

    .text {
        line-height: 50px;
        top: -50px;
        font-size: 18px;
    }
}

.default {
    height: 32px;
    margin: 5px 10px;
    width: 170px;

    .text {
        line-height: 32px;
        top: -32px;
        font-size: 14px;
    }
}

.small {
    height: 20px;
    margin: 3px 6px;
    width: 130px;

    .text {
        line-height: 20px;
        top: -20px;
        font-size: 12px;
    }
}

.cp-svg-btn {
    display: inline-block;
    position: relative;
    color: $default;
    text-decoration: none;
    overflow: hidden;
    transition: 1s;
    box-sizing: border-box;

    .outline {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        stroke: $default;
        stroke-width: 2px;
        fill: transparent;
        transition: 1s;
    }

    .text {
        position: relative;
        // top: -50px;
        font-family: 'Helvetica';
        // font-size: 20px;
        letter-spacing: 1px;
        text-transform: uppercase;
        transition: 1s;
        box-sizing: border-box;
    }

    &:hover {
        .outline {
            stroke: $pink;
            transition: all 1s;
        }

        .text {
            color: $pink;
            transition: all 1s;
        }
    }
}

.cp-svg-btn {
    .outline {
        stroke-dasharray: 25 25;
        stroke-dashoffset: -588;
        transition: all 1s;
    }

    &:hover {
        .outline {
            stroke-dasharray: 50 50;
            stroke-dashoffset: -275;
            transition: all 1s;
        }
    }
}

.svg-2 {
    .outline {
        stroke-dasharray: 50 250;
        stroke-dashoffset: -575;
        transition: all 1s;
    }

    &:hover {
        .outline {
            stroke-dasharray: 50 100;
            stroke-dashoffset: -75;
            transition: all 1s;
        }
    }
}

.svg-3 {
    .outline {
        stroke-dasharray: 70 230;
        stroke-dashoffset: 60;
        transition: all 1s;
    }

    &:hover {
        .outline {
            stroke-dashoffset: -350;
            transition: all 1s;
        }
    }
}

.svg-4 {
    .outline {
        stroke-dasharray: 50 600;
        stroke-dashoffset: -550;
        transition: all 0.5s;
    }

    &:hover {
        .outline {
            stroke-dashoffset: -250;
        }
    }
}

.svg-5 {
    .outline {
        stroke-dasharray: 50 600;
        stroke-dashoffset: -550;
        transition: all 1s;
    }

    &:hover {
        .outline {
            stroke-dasharray: 600 0;
            stroke-dashoffset: 25;
            animation: woop 1s linear;
        }
    }
}

.svg-6 {
    .outline {
        stroke-dasharray: 100 500;
        stroke-dashoffset: 225;
        transition: all 0.5s;
    }

    &:hover {
        .outline {
            stroke-dasharray: 600 0;
            stroke-dashoffset: 475;
        }
    }
}

.svg-7 {
    .outline {
        stroke-dasharray: 50 550;
        stroke-dashoffset: 200;
        transition: all 0.5s;
    }

    &:hover {
        .outline {
            stroke-dasharray: 50 250;
            stroke-dashoffset: 500;
        }
    }
}
</style>