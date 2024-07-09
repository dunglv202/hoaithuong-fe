import type { User } from '@/models/user'
import axios from 'axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isSignedIn = computed(() => !!user.value)

  const fetchUserInfo = async () => {
    try {
      const userInfo: User = (await axios.get('/api/me')).data
      user.value = userInfo
    } catch (error) {
      user.value = null
    }
  }

  fetchUserInfo()

  const signIn = async (username: string, password: string) => {
    await axios.post('/api/auth/signin', { username, password })
    await fetchUserInfo()
    return user.value
  }

  const signOut = async () => {
    await axios.post('/api/auth/signout')
    user.value = null
  }

  return {
    user,
    isSignedIn,
    signIn,
    signOut
  }
})

export default useAuthStore
