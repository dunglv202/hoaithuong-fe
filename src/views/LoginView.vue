<template>
  <el-form class="signin-form" label-position="top" label-width="auto" :model="formLogin">
    <el-form-item label="Username">
      <el-input v-model="formLogin.username" />
    </el-form-item>
    <el-form-item label="Password">
      <el-input v-model="formLogin.password" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button @click="handleSignIn" type="primary" class="signin-btn" :loading="submitting">
        Sign In
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.signin-form {
  width: 300px;
}

.signin-btn {
  width: 100%;
}
</style>

<script lang="ts" setup>
import useAuthStore from '@/stores/auth'
import { ElNotification } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const submitting = ref(false)
const formLogin = reactive({
  username: '',
  password: ''
})

const handleSignIn = async () => {
  try {
    submitting.value = true
    await authStore.signIn(formLogin.username, formLogin.password)
    router.push('/')
  } catch (e) {
    ElNotification({
      title: 'Error',
      message: (e as Error).message,
      type: 'error',
      position: 'bottom-right'
    })
  } finally {
    submitting.value = false
  }
}
</script>
