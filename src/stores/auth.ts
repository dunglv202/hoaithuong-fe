import type { FetchOptions } from '@/models/config'
import type { User } from '@/models/user'
import axios from 'axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const useAuthStore = defineStore('auth', () => {
  const isInitialized = ref(false)
  const user = ref<User | null>(null)
  const isSignedIn = computed(() => !!user.value)

  const fetchUserInfo = async () => {
    try {
      const userInfo: User = (
        await axios.get('/api/me', {
          fetchOptions: { selfHandle: true } as FetchOptions
        })
      ).data
      user.value = userInfo
    } catch (error) {
      user.value = null
    }
  }

  const signIn = async (username: string, password: string) => {
    await axios.post('/api/auth/signin', { username, password })
    await fetchUserInfo()
    return user.value
  }

  const signOut = async () => {
    try {
      await axios.post('/api/auth/signout', null, {
        fetchOptions: { selfHandle: true } as FetchOptions
      })
      user.value = null
    } catch (error) {
      console.error(error)
    }
  }

  const initialize = async () => {
    if (isInitialized.value) return
    await fetchUserInfo()
    isInitialized.value = true
  }

  return {
    user,
    isSignedIn,
    signIn,
    signOut,
    initialize
  }
})

export default useAuthStore
