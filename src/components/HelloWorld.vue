<template>
  <div class="hello">
    <p>当前地址：{{options.src}}</p>
    <vue3VideoPlay width="800px" title="冰河世纪" :src="options.src" :type="options.type" :autoPlay="false" />
    <input type="text" v-model="url" style="width: 800px;margin: 40px 0;">
    <button @click="play">play</button>
    <p>动画片地址：https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8</p>
    <p>测试地址：http://10.170.0.200:8200/hls/test.m3u8</p>
  </div>
</template>

<script>
import { onMounted, reactive,ref } from 'vue'
export default {
  name: 'HelloWorld',
  setup() {
    const options = reactive({
      // 测试地址 https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
      // 地址 http://10.170.0.200:8200/hls/test.m3u8
      src: "http://10.170.0.200:8200/hls/test.m3u8", //视频源
      type: 'm3u8', //视频类型
    })
    const url = ref()
    const play = () =>{
      options.src = url.value
    }
    onMounted(() => {

    })
    return {
      options,
      url,
      play
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello{
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
