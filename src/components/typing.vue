<template>
  <div class="black">
    <div class="h1">{{ props.word }}</div>
  </div>
</template>

<script setup>
import { defineProps} from 'vue'
const props = defineProps({
	word: {
		type: String,
		default: 'TEXT'
	}
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.black {
  background: black;
  color: #fff;
}

.h1 {
  font-weight: bold;
  border-right: 3px solid;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  animation: typing 8s steps(26, end),
    cursor-blink 0.5s step-end infinite alternate;
  animation-delay: 3s;
  font-family: Consolas, Monaco, monospace;
}

@keyframes typing {
  from {
    width: 0;
  }
}

@keyframes cursor-blink {
  50% {
    border-color: transparent;
  }
}
</style>
