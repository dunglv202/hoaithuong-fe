<template>
  <header>
    <div class="header">
      <img class="logo" src="@/assets/logo.svg" alt="logo" />
      <div class="menu">
        <el-dropdown trigger="click" :hide-on-click="false">
          <div class="dropdown-trigger hoverable">
            <el-badge :value="totalUnread" :max="9" :show-zero="false">
              <el-icon :size="19">
                <IconBellRinging />
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
            <el-avatar class="avatar" :src="authStore.user?.avatar" @error="() => true">
              <el-icon>
                <UserFilled />
              </el-icon>
            </el-avatar>
            <el-icon :size="18">
              <IconCaretDownFilled />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToProfile"> Profile </el-dropdown-item>
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

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex-grow: 1;
  position: relative;
  padding: 2rem 0;
}

@media screen and (max-width: 768px) {
  main {
    padding: 1rem 0;
  }
}
</style>

<style scoped>
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
  height: 40px;
  width: 40px;
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
import { UserFilled } from '@element-plus/icons-vue'
import { IconBellRinging, IconCaretDownFilled } from '@tabler/icons-vue'
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
