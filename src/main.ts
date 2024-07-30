import './assets/main.css'

import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus, { ElNotification } from 'element-plus'
import router from './routers'
import { createPinia } from 'pinia'
import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import type { FetchOptions } from './models/config'
import type { ApiError } from './models/common'

const isAccessTokenExpired = (err: AxiosError) => {
  return (
    err.response?.status === 401 && (err.response.data as ApiError).code === 'EXPIRED_ACCESS_TOKEN'
  )
}

const app = createApp(App)
const pinia = createPinia()

axios.interceptors.response.use(
  (resp) => resp,
  async (err) => {
    if (!(err instanceof AxiosError)) return Promise.reject(err)

    if (isAccessTokenExpired(err)) {
      try {
        // refresh token
        await axios.post('/api/auth/refresh')
        return axios(err.config as AxiosRequestConfig)
      } catch (err) {
        return Promise.reject(err)
      }
    }

    if (!(err.config?.fetchOptions as FetchOptions)?.selfHandle) {
      ElNotification({
        type: 'error',
        title: 'Something went wrong',
        message: err.response?.data.error,
        position: 'bottom-right'
      })
    }

    return Promise.reject(err)
  }
)

app.use(router)
app.use(ElementPlus, { size: 'large' })
app.use(pinia)
app.mount('#app')
