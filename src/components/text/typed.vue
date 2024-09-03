<template>
    <div>
        <span class="text">{{ typedMessage }}</span>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';

const text = 'Hello, this is a typing effect!Invalid input: text must be non-empty and delay must be non-negative.';
const delay = 200; // 每个字符之间的延迟，单位为毫秒

const typedMessage = ref('');

let charIndex = 0;
let intervalId: ReturnType<typeof setInterval> | null = null;

const type = () => {
    if (charIndex < text.length) {
        typedMessage.value += text.charAt(charIndex++);
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
.text{
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