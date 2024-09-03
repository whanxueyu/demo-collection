<template>
    <div>
        <div class="cp-svg-btn">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <rect class="outline" height="100%" width="100%" />
                <div class="text">Line Animation</div>
            </svg>
        </div>

        <div class="cp-svg-btn svg-2">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <rect class="outline" height="100%" width="100%" />
                <div class="text">Line Animation</div>
            </svg>
        </div>

        <div class="cp-svg-btn svg-3">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <rect class="outline" height="100%" width="100%" />
                <div class="text">Line Animation</div>
            </svg>
        </div>

        <div class="cp-svg-btn svg-4">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <rect class="outline" height="100%" width="100%" />
                <div class="text">Line Animation</div>
            </svg>
        </div>

        <div class="cp-svg-btn svg-5">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <rect class="outline" height="100%" width="100%" />
                <div class="text">Line Animation</div>
            </svg>
        </div>

        <div class="cp-svg-btn svg-6">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <rect class="outline" height="100%" width="100%" />
                <div class="text">Line Animation</div>
            </svg>
        </div>

        <div class="cp-svg-btn svg-7">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <rect class="outline" height="100%" width="100%" />
                <div class="text">Line Animation</div>
            </svg>
        </div>
    </div>
</template>
<script setup>
import { defineProps, ref } from 'vue';
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
    background: #000;
    text-align: center;
    color: $default;

    *,
    *:before,
    *:after {
        transition: transition(1s);
        box-sizing: box-sizing(border-box);
    }
}

.cp-svg-btn {
    display: inline-block;
    position: relative;
    color: $default;
    text-decoration: none;
    width: 250px;
    height: 50px;
    margin: 50px 10px;
    overflow: hidden;
    translate: all 1s;

    .outline {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        stroke: $default;
        stroke-width: 2px;
        fill: transparent;
        translate: all 1s;
    }

    .text {
        position: relative;
        top: -40px;
        font-family: 'Helvetica';
        font-size: 1.5rem;
        line-height: 1;
        letter-spacing: 1px;
        text-transform: uppercase;
        translate: all 1s;
    }

    &:hover {
        .outline {
            stroke: $pink;
            translate: all 1s;
        }

        .text {
            color: $pink;
            translate: all 1s;
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