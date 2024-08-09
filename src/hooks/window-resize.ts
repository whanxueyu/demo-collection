import { ref, onMounted, onUnmounted } from "vue";

export const useWindowResize = (cb?: Function) => {
  const width = ref<number>(window.innerWidth);
  const height = ref<number>(window.innerHeight);

  onMounted(() => {
    window.addEventListener("resize", resize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", resize);
  });

  const resize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
    cb && cb();
  };
};
