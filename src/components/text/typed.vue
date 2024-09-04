<!--
 * @Author: anxueyu
 * @Date: 2024-09-03 17:28:08
 * @LastEditors: anxueyu 1358042645@qq.com
 * @LastEditTime: 2024-09-04 13:31:57
 * @FilePath: \demo-collection\src\components\text\typed.vue
 * @Description: 
-->
<template>
    <span class="cp-typed">
        <slot v-if="false"></slot>
        {{ typedMessage }}
    </span>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, useSlots } from 'vue';
const text = ref('')

const slots = useSlots();
if (slots && slots.default) {
    let tep = slots.default();
    text.value = tep[0].children as string
    console.log(text.value)
}
const delay = 200; // 每个字符之间的延迟，单位为毫秒

const typedMessage = ref('');

let charIndex = 0;
let intervalId: ReturnType<typeof setInterval> | null = null;

const type = () => {
    if (charIndex < text.value.length) {
        typedMessage.value += text.value.charAt(charIndex++);
    } else {
        clearInterval(intervalId);
        intervalId = null;
    }
};

if (text && delay >= 0) {
    intervalId = setInterval(type, delay);
} else {
    console.error('Invalid input: text must be non-empty and delay must be non-negative.');
}

onBeforeUnmount(() => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
});

</script>
<style scoped lang="scss">
.cp-typed {
    border-right: 3px solid;
    animation: cursor-blink 0.5s step-end infinite alternate;
    font-family: Consolas, Monaco, monospace;
    font-weight: bold;
    padding-right: 5px;
}

@keyframes cursor-blink {
    50% {
        border-color: transparent;
    }
}
</style>