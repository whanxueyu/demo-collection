<template>
  <div class="glow-text">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

defineOptions({
  name: 'CpGlowText',
})
const props = defineProps({
  color: {
    type: String,
    default: '#e91e84',
  },
})
onMounted(() => {
  document.documentElement.style.setProperty('--child-color', props.color)
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.glow-text {
  display: inline-block;
  font-family: 'Lobster';
  text-align: center;
  font-size: 26px;
  line-height: 40px;
  color: var(--child-color);
  cursor: pointer;

  &:hover {
    color: #fff;
    animation: pink 1.5s ease-in-out infinite alternate;
  }
}

@keyframes pink {
  to {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px var(--child-color), 0 0 35px var(--child-color), 0 0 40px var(--child-color), 0 0 50px var(--child-color), 0 0 75px var(--child-color);
  }

  from {
    filter: brightness(110%);
    text-shadow: 0 0 2px #fff, 0 0 5px #fff, 0 0 8px #fff, 0 0 10px var(--child-color), 0 0 17px var(--child-color), 0 0 20px var(--child-color), 0 0 25px var(--child-color), 0 0 40px var(--child-color);

  }
}
</style>