<template>
    <div>
      <p>{{ typedMessage }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onBeforeUnmount } from 'vue';
  
  const text = 'Hello, this is a typing effect!';
  const delay = 500; // 每个字符之间的延迟，单位为毫秒
  
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
  
  // 分批处理
  const batchSize = 100; // 每次处理的最大字符数
  const maxDelay = 1000; // 最大延迟时间
  const processBatch = () => {
    for (let i = 0; i < Math.min(batchSize, text.length - charIndex); i++) {
      typedMessage.value += text.charAt(charIndex++);
    }
    if (charIndex < text.length) {
      setTimeout(processBatch, delay);
    } else {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  
  if (text && delay >= 0) {
    processBatch();
  } else {
    console.error('Invalid input: text must be non-empty and delay must be non-negative.');
  }
  </script>