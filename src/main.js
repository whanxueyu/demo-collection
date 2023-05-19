import { createApp } from 'vue'
import App from './App.vue'
let app = createApp(App)
import vue3videoPlay from 'vue3-video-play' // 引入组件
import 'vue3-video-play/dist/style.css' // 引入css
import router from './router/index.js'
app.use(vue3videoPlay)
app.use(router)

app.mount('#app')
