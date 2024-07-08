import type { User } from '@/models/user'
import { defineStore } from 'pinia'

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null
  }),
  getters: {
    isSignedIn: (state) => !!state.user
  },
  actions: {
    async signIn(username: string, password: string) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const success = Math.random() > 0.5
          if (success) {
            this.user = {
              username,
              displayName: username
            }
            resolve(this.user)
          } else {
            reject(new Error('Bad credentials'))
          }
        }, 1000)
      })
    },

    async signOut() {
      this.user = null
    }
  }
})

export default useAuthStore
