<template>
  <div class="black">
    <div class="h1">{{ word }}</div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive } from 'vue'
export default defineComponent({
  name: 'typing',
  props: {
    word: {
      type: String,
      default: ''
    }
  },
  setup() {
    const options = reactive({
    })
    onMounted(() => {

    })
    return {
      options,
    }
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
  font: bold 200% Consolas, Monaco, monospace;
  border-right: 3px solid;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  animation: typing 8s steps(26, end),
    cursor-blink 0.5s step-end infinite alternate;
  animation-delay: 3s;
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
