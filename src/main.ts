import './assets/main.css'

import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './routers'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(ElementPlus, { size: 'large' })
app.use(pinia)
app.mount('#app')
