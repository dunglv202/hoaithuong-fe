<template>
    <header>
        <div class="header">
            <img src="@/assets/logo.svg" alt="logo" height="48" />
            <div class="menu">
                <el-dropdown trigger="click" :hide-on-click="false">
                    <div class="dropdown-trigger">
                        <el-badge :value="totalUnread" :max="10" :show-zero="false">
                            <el-icon :size="19">
                                <IconBellRinging />
                            </el-icon>
                        </el-badge>
                    </div>
                    <template #dropdown>
                        <div class="noti-menu">
                            <el-empty v-if="!notifications.length" description="Nothing here" :image-size="80" />
                        </div>
                        <el-dropdown-menu class="noti-menu">
                            <el-dropdown-item class="noti" :class="noti.read ? 'read' : undefined"
                                v-for="noti in notifications" :key="noti.id" @click="readNoti(noti)">
                                {{ noti.content }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
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

.noti:not(.read) {
    font-weight: bold;
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

.dropdown-trigger:hover {
    color: var(--el-color-primary);
}

.noti-menu {
    width: 300px;
}
</style>

<script lang="ts" setup>
import type { Notification } from "@/models/notification";
import { getNotifications } from "@/services/noti-service";
import useAuthStore from "@/stores/auth";
import { UserFilled } from '@element-plus/icons-vue';
import { IconBellRinging, IconCaretDownFilled } from "@tabler/icons-vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter()
const authStore = useAuthStore()

const totalUnread = ref(0)
const notifications = ref<Notification[]>([])

const fetchNotifications = async () => {
    const fetchResult = await getNotifications();
    notifications.value = fetchResult.notifications
    totalUnread.value = fetchResult.totalUnread
}

const readNoti = async (noti: Notification) => {
    noti.read = true
}

const signOut = async () => {
    await authStore.signOut()
    router.push('/signin')
}

onMounted(() => {
    fetchNotifications()
})
</script>