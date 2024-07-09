<template>
    <header>
        <div class="header">
            <img src="@/assets/logo.svg" alt="logo" height="48" />
            <div class="menu">
                <span>
                    Welcome back,
                    <strong class="name">
                        {{ authStore.user?.displayName || 'Anonymous' }}
                    </strong>
                </span>
                <el-dropdown trigger="click">
                    <div class="dropdown-trigger">
                        <el-avatar :size="40" :src="authStore.user?.avatar" @error="() => true">
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
                            <el-dropdown-item>Account</el-dropdown-item>
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
</style>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
}

.menu {
    display: flex;
    align-items: center;
    gap: 16px;
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

.dropdown-trigger:hover {
    color: var(--el-color-primary);
}
</style>

<script lang="ts" setup>
import { UserFilled } from '@element-plus/icons-vue'
import useAuthStore from "@/stores/auth";
import { IconCaretDownFilled } from "@tabler/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter()
const authStore = useAuthStore()

const signOut = async () => {
    await authStore.signOut()
    router.push('/signin')
}
</script>