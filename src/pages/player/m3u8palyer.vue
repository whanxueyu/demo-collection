<template>
    <div class="hello">
        <h1>m3u8 Player Demo</h1>
      <p>当前地址：{{ options.src }}</p>
      <vue3VideoPlay width="90%" title="冰河世纪" :src="options.src" :type="options.type" :autoPlay="false" />
      <div class="inputbox">
        <input type="text" v-model="url" style="width: 75%;height: 30px;margin: 40px 0;" placeholder="请输入m3u8视频地址">
        <button class="palybtn" @click="play">播放</button>
      </div>
      <div class="text">
        <p>动画片地址：https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8</p>
        <p>测试地址：http://10.170.0.200:8200/hls/test.m3u8</p>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, reactive, ref } from 'vue'
  export default {
    name: 'HelloWorld',
    setup() {
      const options = reactive({
        // 测试地址 https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
        src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", //视频源
        type: 'm3u8', //视频类型
      })
      const url = ref()
      const play = () => {
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
  .hello {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .text {
    width: 90vw;
    text-align: left;
  }
  
  .inputbox {
    width: 90vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .palybtn {
    padding: 7px 15px;
  }
  </style>
  