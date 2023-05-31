<template>
    <div id="con">
        <div class="g-container" id="element" ref="element" :style="'transform:' + transform">
            <div class="border"></div>
            <div class="border-particle"></div>
            <div class="circle"></div>
        </div>
        <svg width="0">
            <filter id="particle">
                <feTurbulence id="animation" type="fractalNoise" baseFrequency="9.9999999 9.9999999" numOctaves="10"
                    result="warp">
                    <animate attributeName="baseFrequency" from="9.9999999 9.9999999" to="0.01 0.0001" dur="2s"
                        repeatCount="indefinite" />
                </feTurbulence>
                <feOffset dx="-90" dy="-90" result="warpOffset"></feOffset>
                <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="100" in="SourceGraphic"
                    in2="warpOffset">
                </feDisplacementMap>
            </filter>
        </svg>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
const multiple = 10;
const element = ref(null);
const transform = ref('')
onMounted(() => {
    console.log(element.value.getBoundingClientRect())
    window.addEventListener('mousemove', (e) => {
        window.requestAnimationFrame(function () {
            transformElement(e.clientX, e.clientY);
        });
    });
});
let box = {
    bottom: 540,
    height: 300,
    left: 516.5,
    right: 816.5,
    top: 240,
    width: 300,
    x: 516.5,
    y: 240,
}
const transformElement = (x, y) => {

    box = element.value.getBoundingClientRect()
    let calcX = -(y - box.y - (box.height / 2)) / multiple;
    let calcY = (x - box.x - (box.width / 2)) / multiple;
    transform.value = "rotateX(" + calcX + "deg) " + "rotateY(" + calcY + "deg)";
}

</script>
<style scoped lang="scss">
@property --height {
    syntax: '<length>';
    inherits: false;
    initial-value: 1px;
}

:root {
    --mainColor: #02ffff;
}
#con{
    height: 100%;
    width: 100%;
}

.g-container {
    position: relative;
    margin: auto;
    padding: 200px 0;
    width: 300px;
    height: 300px;
    transform-style: preserve-3d;
    cursor: pointer;
    // transition: .1s;

    &:hover .border-particle {
        filter: url('#particle');
    }
}

.border-particle {
    position: absolute;
    width: 700px;
    height: 700px;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, -20px);
    transform-style: preserve-3d;
    transition: 0 .2s;


    &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 300px;
        height: 300px;
        border: 15px solid #ed243c;
        border-radius: 50%;
        transform: translate(-50%, -50%);
    }
}

.border {
    position: relative;
    height: 300px;
    border-radius: 50%;
    border: 10px solid #02ffff;
    box-shadow: inset 0 0 0 5px #2968d9;
    box-sizing: border-box;
}

.circle {
    --height: 1px;
    position: absolute;
    width: 5px;
    height: var(--height);
    --halfHeight: calc((var(--height) + 35px) / 2);
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% - var(--halfHeight)));
    color: var(--mainColor);
    border-top: 35px solid currentColor;
    transform-origin: 50% 100%;
    -webkit-box-reflect: below;
    filter: drop-shadow(0 0 10px #2968d9);
    animation: rotate 10s infinite ease-in-out;

    &::before,
    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 5px;
        height: inherit;
        border-top: 35px solid currentColor;
        transform-origin: 50% 100%;
        -webkit-box-reflect: below;
    }

    &::after {
        transform: rotate(60deg);
    }

    &::before {
        transform: rotate(120deg);
    }
}


@keyframes rotate {
    50% {
        --height: 50px;
        filter: drop-shadow(0 0 10px #2968d9) hue-rotate(360deg);
        transform: translate(-50%, calc(-50% - var(--halfHeight))) rotate(1080deg) translateZ(30px);
    }

    100% {
        transform: translate(-50%, calc(-50% - var(--halfHeight))) rotate(2160deg) translateZ(0px);
    }
}
</style>
