import './assets/main.css'

import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import ElementPlus, { ElMessage, ElNotification } from 'element-plus'
import 'element-plus/dist/index.css'
import moment from 'moment'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import type { ApiError } from './models/common'
import type { FetchOptions } from './models/config'
import router from './routers'
import { MOBILE_BREAKPOINT } from './configs/layout-config'

const app = createApp(App)
const pinia = createPinia()

moment.updateLocale('en', {
  week: {
    dow: 1,
    doy: 4
  }
})

const isAccessTokenExpired = (err: AxiosError) => {
  return (
    err.response?.status === 401 && (err.response.data as ApiError).code === 'EXPIRED_ACCESS_TOKEN'
  )
}

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
      if (window.innerWidth >= MOBILE_BREAKPOINT) {
        ElNotification({
          type: 'error',
          title: 'Something went wrong',
          message: err.response?.data.error,
          position: 'bottom-right'
        })
      } else {
        ElMessage.error(err.response?.data.error)
      }
    }

    return Promise.reject(err)
  }
)

app.use(router)
app.use(ElementPlus, { size: 'large' })
app.use(pinia)
app.mount('#app')
