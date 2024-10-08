<template>
  <header>
    <div class="header">
      <img class="logo" src="@/assets/logo.svg" alt="logo" />
      <div class="menu">
        <el-dropdown trigger="click" :hide-on-click="false">
          <div class="dropdown-trigger hoverable">
            <el-badge :value="totalUnread" :max="9" :show-zero="false">
              <el-icon :size="23">
                <IconConfetti />
              </el-icon>
            </el-badge>
          </div>
          <template #dropdown>
            <NotificationArea @unread-change="totalUnread = $event" />
          </template>
        </el-dropdown>
        <span class="name-area">
          Hi,
          <strong class="name">
            {{ authStore.user?.displayName || 'Anonymous' }}
          </strong>
        </span>
        <el-dropdown trigger="click">
          <div class="dropdown-trigger hoverable">
            <el-avatar class="avatar" :src="authStore.user?.avatar">
              <img class="placeholder" src="@/assets/user.svg" alt="avatar" />
            </el-avatar>
            <el-icon :size="18">
              <IconCaretDownFilled />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToProfile">Profile</el-dropdown-item>
              <el-dropdown-item @click="signOut">Sign out</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.avatar img.placeholder {
  width: 50%;
  height: 50%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  height: 36px;
}

.menu {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.name {
  font-weight: bold;
}

.dropdown-trigger {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
}

.avatar {
  height: 44px;
  width: 44px;
}

.name-area {
  color: var(--el-text-color-regular);
}

@media screen and (max-width: 768px) {
  .name-area {
    display: none;
  }

  .logo {
    height: 34px;
  }

  .avatar {
    height: 44px;
    width: 44px;
  }
}
</style>

<script lang="ts" setup>
import NotificationArea from '@/components/NotificationArea.vue'
import useAuthStore from '@/stores/auth'
import { IconCaretDownFilled, IconConfetti } from '@tabler/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const totalUnread = ref(0)

const signOut = async () => {
  await authStore.signOut()
  router.push('/signin')
}

const goToProfile = () => {
  router.push('/profile')
}
</script>
