<template>
    <div>
        <span class='C'>C</span>
        <span class='S'>S</span>
        <span class='S'>S</span>
        <span class='3'>3</span>
        <span class='D'>D</span>
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
@import url(https://fonts.googleapis.com/css?family=Crimson+Text);
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
$bright : #AFA695;
$gold : #867862;
$dark : #746853;

$duration : 8s;

body,
html {
    width: 100%;
    height: 100%;
    display: flex;
    background: #000;
    overflow: hidden;
}

div {
    margin: auto;
    perspective: 2000px;
    transform-style: preserve-3d;
    font: 10vw Righteous;
    animation: fade $duration infinite;
}

span {
    position: relative;
    display: inline-block;
    min-width: .5em;
    text-align: center;
    transform-style: preserve-3d;
    transform: rotateY(25deg);
    animation: rotate $duration infinite ease-in;
    color: black;

    &:after,
    &:before {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        content: attr(class);
        color: $gold;
        z-index: -1;
        animation: shadow $duration infinite;
    }

    &:before {
        transform: translateZ(-14px);
    }

    &:after {
        transform: translateZ(-7px);
    }
}

@keyframes fade {
    from {
        transform: scale(1.2);
    }

    25% {
        opacity: 1;
    }

    100% {
        transform: scale(1);
    }
}

@keyframes rotate {
    from {
        transform: rotateY(38deg);
    }

    50%,
    100% {
        color: $dark;
        transform: rotateY(0deg);
    }

    100% {
        color: $gold;
    }
}

@keyframes shadow {
    from {
        color: shade($gold, 50%);
    }

    25% {
        color: $bright;
    }

    50%,
    100% {
        color: tint($gold, 100%);
    }
}
</style>