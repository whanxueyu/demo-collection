<template>
    <!-- <div class="demo-cube perspective percentage">
        <ul class="cube">
            <li class="top"></li>
            <li class="bottom"></li>
            <li class="front"></li>
            <li class="back"></li>
        </ul>
    </div>

    <div class="demo-cube perspective colorful">
        <ul class="cube">
            <li class="top"></li>
            <li class="bottom"></li>
            <li class="front"></li>
            <li class="back"></li>
        </ul>
    </div> -->

    <div class="demo-cube perspective pink">
        <ul class="cube">
            <li class="top"></li>
            <li class="bottom"></li>
            <li class="front"></li>
            <li class="back"></li>
        </ul>
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
@property --per {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 0%;
}

.perspective {
    transform-style: preserve-3d;
    perspective: 520px;
    transform: rotateX(15deg);
}

.demo-cube {
    position: relative;
    width: 100%;
    height: 200px;
    margin: auto;
    margin-top: -30px;

    .cube {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 600px;
        height: 100px;
        transform-style: preserve-3d;
        transform-origin: 50px 50px;
        transform: translate(-50%, -50%) rotateX(-33.5deg);

        li {
            position: absolute;
            display: block;
            width: 100%;
            height: 100px;
        }

        .top {
            transform: rotateX(90deg) translateZ(50px);
        }

        .bottom {
            transform: rotateX(-90deg) translateZ(50px);
        }

        .front {
            transform: translateZ(50px);
        }

        .back {
            transform: rotateX(-180deg) translateZ(50px);
        }
    }
}

.percentage .cube {

    .top,
    .front,
    .bottom,
    .back {
        background: linear-gradient(90deg, rgba(156, 39, 176, .3), rgba(255, 34, 109, .8) 70%, rgba(255, 255, 255, .6) 70%, rgba(255, 255, 255, .6));
    }
}

.colorful {
    animation: hueRotate 10s infinite linear;

    .cube {

        .top,
        .front,
        .bottom,
        .back {
            background: linear-gradient(90deg, rgba(40, 101, 127, .9), rgba(133, 165, 181, .5) 85%, rgba(255, 255, 255, .6) 85%, rgba(255, 255, 255, .6));
        }
    }
}

.pink .cube {

    .top,
    .front,
    .bottom,
    .back {
        background: linear-gradient(90deg, rgba(255, 217, 34, .6), rgba(255, 34, 109, .8) var(--per), rgba(255, 34, 109, .1) var(--per), rgba(255, 34, 109, .1));
        animation: perChange 2s ease-in-out;
    }
}

@keyframes perChange {
    0% {
        --per: 0%;
    }

    98%,
    to {
        --per: 100%;
    }
}

@keyframes hueRotate {
    0% {
        filter: hue-rotate(0);
    }

    100% {
        filter: hue-rotate(360deg);
    }
}
</style>