import { createApp } from 'vue'
import App from './App.vue'
let app = createApp(App)
import vue3videoPlay from 'vue3-video-play' // 引入组件
import 'vue3-video-play/dist/style.css' // 引入css
import router from './router/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/theme-chalk/dark/css-vars.css'
import AFRAME from 'aframe';
import '@/static/css/theme.scss';
import '@/static/css/common.scss';
import pinia from './store'

app.use(vue3videoPlay)
app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
})
app.use(AFRAME);
app.use(pinia)

app.mount('#app')
