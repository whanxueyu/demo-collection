<template>
    <div class="light">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        {{ text }}
    </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
    name: 'button3',
    props: {
        text: {
            type: String,
            default: 'TEXT'
        }
    },
    setup() {
        const data = reactive({
        });
        return {
            ...toRefs(data),
        };
    },
});
</script>
<style lang="scss" scoped>
.light {
  position: relative;
  padding: 25px 30px;
  color: #faee49;
  font-size: 24px;
  text-transform: uppercase;
  transition: 0.5s;
  letter-spacing: 4px;
  cursor: pointer;
  overflow: hidden;
}
.light:hover {
  background-color: #faee49;
  color: #050801;
  box-shadow: 0 0 5px #faee49,
              0 0 25px #faee49,
              0 0 50px #faee49,
              0 0 200px #faee49;
}
.light div {
  position: absolute;
}
.light div:nth-child(1){
  width: 100%;
  height: 2px;
  top: 0;
  left: -100%;
  background: linear-gradient(to right,transparent,#faee49);
  animation: animate1 1s linear infinite;
}
.light div:nth-child(2){
  width: 2px;
  height: 100%;
  top: -100%;
  right: 0;
  background: linear-gradient(to bottom,transparent,#faee49);
  animation: animate2 1s linear infinite;
  animation-delay: 0.25s;
}
.light div:nth-child(3){
  width: 100%;
  height: 2px;
  bottom: 0;
  right: -100%;
  background: linear-gradient(to left,transparent,#faee49);
  animation: animate3 1s linear infinite;
  animation-delay: 0.5s;
}
.light div:nth-child(4){
  width: 2px;
  height: 100%;
  bottom: -100%;
  left: 0;
  background: linear-gradient(to top,transparent,#faee49);
  animation: animate4 1s linear infinite;
  animation-delay: 0.75s;
}
@keyframes animate1 {
  0% {
    left: -100%;
  }
  50%,100% {
    left: 100%;
  }
}
@keyframes animate2 {
  0% {
    top: -100%;
  }
  50%,100% {
    top: 100%;
  }
}
@keyframes animate3 {
  0% {
    right: -100%;
  }
  50%,100% {
    right: 100%;
  }
}
@keyframes animate4 {
  0% {
    bottom: -100%;
  }
  50%,100% {
    bottom: 100%;
  }
}

</style>