<template>
  <div class="container">
    <div class="logo">
      <img src="@/assets/logo.svg" alt="Logo" height="54" />
    </div>
    <el-form
      class="signin-form"
      label-position="top"
      label-width="auto"
      :model="formLogin"
      @keyup.enter="handleSignIn"
    >
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
      <el-divider> Or </el-divider>
      <el-form-item>
        <el-button @click="handleSignInWithGoogle" class="signin-btn">
          <el-icon :size="22">
            <IconBrandGoogleFilled />
          </el-icon>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.container {
  flex-grow: 1;
  padding-bottom: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.signin-form {
  width: 400px;
  margin-top: 1.5rem;
}

.signin-btn {
  width: 100%;
}

@media screen and (max-width: 768px) {
  .signin-form {
    width: 100%;
  }
}
</style>

<script lang="ts" setup>
import useAuthStore from '@/stores/auth'
import { IconBrandGoogleFilled } from '@tabler/icons-vue'
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
  } finally {
    submitting.value = false
  }
}

const handleSignInWithGoogle = () => {
  location.href = '/oauth2/authorization/google'
}
</script>
