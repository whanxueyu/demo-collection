<template>
    <div class="cp-break-text" :data-text="content">
        <span>
            <slot></slot>
        </span>
    </div>
</template>
<script setup lang="ts">
import { ref, useSlots } from 'vue';
defineOptions({
    name: 'CpBreakText',
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
        default: '#fff'
    },
})

</script>

<style lang="scss" scoped>
.cp-break-text {
    position: relative;
    margin: 0 50%;
    letter-spacing: 0.02em;
    // text-transform: uppercase;
    text-shadow: 0 0 10px blue;
    user-select: none;
    white-space: nowrap;
    filter: blur(0.007em);
    animation: shake .5s linear forwards;
}

.cp-break-text span {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    clip-path: polygon(10% 0%, 44% 0%, 70% 100%, 55% 100%);
}

.cp-break-text::before,
.cp-break-text::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
}

.cp-break-text::before {
    animation: crack1 2.5s linear forwards;
    clip-path: polygon(0% 0%, 10% 0%, 55% 100%, 0% 100%);
}

.cp-break-text::after {
    animation: crack2 2.5s linear forwards;
    clip-path: polygon(44% 0%, 100% 0%, 100% 100%, 70% 100%);
}

@keyframes shake {

    5%,
    15%,
    25%,
    35%,
    55%,
    65%,
    75%,
    95% {
        filter: blur(0.018em);
        transform: translateY(0.018em) rotate(0deg);
    }

    10%,
    30%,
    40%,
    50%,
    70%,
    80%,
    90% {
        filter: blur(0.01em);
        transform: translateY(-0.018em) rotate(0deg);
    }

    20%,
    60% {
        filter: blur(0.03em);
        transform: translate(-0.018em, 0.018em) rotate(0deg);
    }

    45%,
    85% {
        filter: blur(0.03em);
        transform: translate(0.018em, -0.018em) rotate(0deg);
    }

    100% {
        filter: blur(0.007em);
        transform: translate(0) rotate(-0.5deg);
    }
}

@keyframes crack1 {

    0%,
    95% {
        transform: translate(-50%, -50%);
    }

    100% {
        transform: translate(-53%, -47%);
    }
}

@keyframes crack2 {

    0%,
    95% {
        transform: translate(-50%, -50%);
    }

    100% {
        transform: translate(-47%, -53%);
    }
}
</style>