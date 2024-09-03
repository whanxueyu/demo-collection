<template>
    <div class="cp-text" :data-word="content">
        <slot></slot>
        <div class="cp-text-line" :style="'background: ' + props.lineColor"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, useSlots } from 'vue';
defineOptions({
    name: 'CpText',
})
const content = ref('')

const slots = useSlots();
if (slots && slots.default) {
    let tep = slots.default();
    content.value = tep[0].children as string
}
const props = defineProps({
    lineColor: {
        type: String,
        default: '#000'
    },
})

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.cp-text {
    position: relative;
    font-size: 26px;
    font-family: Raleway, Verdana, Arial;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
}

.cp-text-line {
    position: absolute;
    left: 8px;
    width: 100%;
    height: 2px;
    z-index: 4;
    animation: whiteMove 3s ease-out infinite;
}

.cp-text::before {
    content: attr(data-word);
    position: absolute;
    top: 0;
    left: 0.5px;
    // height: 0px;
    // color: rgba(255, 255, 255, 0.9);
    overflow: hidden;
    z-index: 2;
    animation: redShadow 1s ease-in infinite;
    filter: contrast(200%);
    text-shadow: 2px 0 0 rgb(255, 0, 179);
}

.cp-text::after {
    --slice-0: inset(50% 50% 50% 50%);
    --slice-1: inset(80% -6px 0 0);
    --slice-2: inset(50% -6px 30% 0);
    --slice-3: inset(10% -6px 85% 0);
    --slice-4: inset(40% -6px 43% 0);
    --slice-5: inset(80% -6px 5% 0);
    content: attr(data-word);
    position: absolute;
    top: 0;
    left: -3px;
    // height: 36px;
    // color: rgba(255, 255, 255, 0.8);
    overflow: hidden;
    z-index: 3;
    // background: rgba(0, 0, 0, 0.8);
    animation: redHeight 1.5s ease-out infinite;
    filter: contrast(200%);
    text-shadow: -2px 0 0 rgb(0, 195, 255);
    mix-blend-mode: darken;
    clip-path: var(--slice-0);

}

.cp-text:hover::after {
    animation: glitch 1s;
    animation-timing-function: steps(2, end);
}

@keyframes glitch {
    0% {
        clip-path: var(--slice-1);
        transform: translate(-20px, -10px);
    }

    10% {
        clip-path: var(--slice-3);
        transform: translate(10px, 10px);
    }

    20% {
        clip-path: var(--slice-1);
        transform: translate(-10px, 10px);
    }

    30% {
        clip-path: var(--slice-3);
        transform: translate(0px, 5px);
    }

    40% {
        clip-path: var(--slice-2);
        transform: translate(-5px, 0px);
    }

    50% {
        clip-path: var(--slice-3);
        transform: translate(5px, 0px);
    }

    60% {
        clip-path: var(--slice-4);
        transform: translate(5px, 10px);
    }

    70% {
        clip-path: var(--slice-2);
        transform: translate(-10px, 10px);
    }

    80% {
        clip-path: var(--slice-5);
        transform: translate(20px, -10px);
    }

    90% {
        clip-path: var(--slice-1);
        transform: translate(-10px, 0px);
    }

    100% {
        clip-path: var(--slice-1);
        transform: translate(0);
    }
}

@keyframes redShadow {
    20% {
        height: 32px;
    }

    60% {
        height: 6px;
    }

    100% {
        height: 42px;
    }
}

@keyframes redHeight {
    20% {
        height: 42px;
    }

    35% {
        height: 12px;
    }

    50% {
        height: 40px;
    }

    60% {
        height: 20px;
    }

    70% {
        height: 34px;
    }

    80% {
        height: 22px;
    }

    100% {
        height: 0px;
    }
}

@keyframes whiteMove {
    8% {
        top: 38px;
    }

    14% {
        top: 8px;
    }

    20% {
        top: 42px;
    }

    32% {
        top: 2px;
    }

    99% {
        top: 30px;
    }
}
</style>