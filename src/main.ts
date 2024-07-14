import './assets/main.css'

import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus, { ElNotification } from 'element-plus'
import router from './routers'
import { createPinia } from 'pinia'
import axios, { AxiosError } from 'axios'
import type { FetchOptions } from './models/config'

const app = createApp(App)
const pinia = createPinia()

axios.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error instanceof AxiosError && !(error.config?.fetchOptions as FetchOptions)?.selfHandle) {
      ElNotification({
        type: 'error',
        title: 'Something went wrong',
        message: error.response?.data.error,
        position: 'bottom-right'
      })
    }

    return Promise.reject(error)
  }
)

app.use(router)
app.use(ElementPlus, { size: 'large' })
app.use(pinia)
app.mount('#app')
