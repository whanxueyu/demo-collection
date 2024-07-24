<template>
  <div class="hello">
    <div class="title">
      <h1>m3u8 Player Demo</h1>
      <p>当前地址：{{ options.src }}</p>
    </div>
    <vue3VideoPlay width="90%" :title="options.name" :src="options.src" :type="options.type" :autoPlay="false" />
    <div class="inputbox">
      <input type="text" v-model="url" style="width: 75%;height: 30px;margin: 40px 0;" placeholder="请输入m3u8视频地址">
      <el-button class="palybtn" type="primary" plain @click="play">播放</el-button>
    </div>
    <div class="text">
      <div class="flex align-center">
        <span class="url">动画片地址: {{ options.playUrl }}</span>
        <el-icon class="copy" @click="copy(options.playUrl)">
          <CopyDocument />
        </el-icon>
      </div>
      <div class="flex align-center">
        <span class="url">项目测试地址: {{ options.testUrl }}</span>
        <el-icon class="copy" @click="copy(options.testUrl)">
          <CopyDocument />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const options = reactive({
  name: '测试视频',
  // 测试地址 https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
  src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", //视频源
  type: 'm3u8', //视频类型
  testUrl: 'http://10.170.0.200:8200/hls/test.m3u8',
  playUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
})
const url = ref()
const play = () => {
  options.src = url.value
}
const copy = (url) => {
  // 创建输入框元素
  const input = document.createElement('input');//不会保留文本格式
  //如果要保留文本格式，比如保留换行符，或者多行文本，可以使用  textarea 标签，再配和模板字符串 ` `
  //const input = document.createElement('textarea')
  // 将想要复制的值
  input.value = url;
  // 页面底部追加输入框
  document.body.appendChild(input);
  // 选中输入框
  input.select();
  // 执行浏览器复制命令
  document.execCommand('Copy');
  // 弹出复制成功信息
  ElMessage.success('复制成功');
  // 复制后移除输入框
  input.remove();
}
onMounted(() => {

})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  margin: auto;
}

.title {
  h1 {
    margin-top: 20px;
  }

  p {
    line-height: 30px;
    color: #cdcdcd;
  }
}

.text {
  width: 100%;
  text-align: left;
  color: #cdcdcd;

  .url {
    margin-right: 15px;
    line-height: 36px;
  }

  .copy {
    cursor: pointer;

    &:hover {
      color: #fff;
    }
  }
}

.inputbox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.palybtn {
  padding: 7px 15px;
}
</style>