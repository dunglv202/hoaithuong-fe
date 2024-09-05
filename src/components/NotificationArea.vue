<template>
  <div class="noti-menu">
    <el-empty v-if="!notifications.length" description="Nothing here" :image-size="80" />
  </div>
  <el-dropdown-menu class="noti-menu" v-if="notifications.length">
    <div class="align-right">
      <el-button class="btn__mark-all-read" link @click="readAll"> Mark all as read </el-button>
    </div>
    <ul class="noti-list">
      <li
        class="noti"
        :class="noti.read ? 'read' : undefined"
        v-for="noti in notifications"
        :key="noti.id"
        @click="!noti.read ? readNoti(noti) : undefined"
      >
        <el-badge is-dot :hidden="noti.read">
          <div>{{ noti.content }}</div>
          <span class="timediff">{{ formatAsDiff(new Date(noti.timestamp)) }}</span>
        </el-badge>
      </li>
    </ul>
    <el-divider class="divider" />
    <el-button class="btn__view-all" link @click="$router.push('/notifications')">
      View all
    </el-button>
  </el-dropdown-menu>
</template>

<style scoped>
.divider {
  margin: 7px 0;
}

.noti-menu {
  width: 280px;
}

.noti-list {
  list-style-type: none;
  padding: 0;
}

.noti {
  padding: 4px 1rem;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.noti:hover {
  background-color: var(--el-dropdown-menuItem-hover-fill);
}

.noti.read {
  color: var(--el-text-color-secondary);
  cursor: default;
}

.timediff {
  font-size: 12px;
  font-style: italic;
}

.noti.read .timediff {
  color: var(--el-text-color-secondary);
}

.btn__view-all,
.btn__mark-all-read {
  padding: 7px;
  --el-button-size: initial;
}

.btn__view-all {
  margin: 0 auto;
  display: block;
}

.align-right {
  display: flex;
  justify-content: flex-end;
}
</style>

<script lang="ts" setup>
import type { Notification } from '@/models/notification'
import { getNotifications, readAllNotifications, readNotification } from '@/services/noti-service'
import { formatAsDiff, MINUTE } from '@/utils/date-time'
import { Client } from '@stomp/stompjs'
import { ElNotification } from 'element-plus'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const MAX_NOTI = 5

const emit = defineEmits<{
  unreadChange: [value: number]
}>()

const notifications = ref<Notification[]>([])
const totalUnread = ref(0)
const client = new Client({
  brokerURL: `wss://${import.meta.env.VITE_BACKEND_HOST}/ws/websocket`,
  onConnect: () => {
    client.subscribe('/user/queue/notifications', (message) => {
      const newNoti: Notification = JSON.parse(message.body)
      notifications.value = [newNoti, ...notifications.value].slice(0, MAX_NOTI)
      ElNotification({
        type: 'info',
        title: 'Notification',
        message: newNoti.content,
        position: 'bottom-right'
      })
      totalUnread.value++
    })
  }
})
const updateTimeDiffInterval = setInterval(() => {
  notifications.value = [...notifications.value]
}, 1 * MINUTE)

const fetchNotifications = async () => {
  const fetchResult = await getNotifications({ size: MAX_NOTI })
  notifications.value = fetchResult.notifications
  totalUnread.value = fetchResult.totalUnread
}

const readNoti = async (noti: Notification) => {
  await readNotification(noti.id)
  noti.read = true
  totalUnread.value--
}

const readAll = async () => {
  await readAllNotifications()
  notifications.value.forEach((noti) => (noti.read = true))
  totalUnread.value = 0
}

watch(totalUnread, (value) => emit('unreadChange', value))

onMounted(() => {
  fetchNotifications()
  client.activate()
})

onUnmounted(() => {
  client.deactivate()
  clearInterval(updateTimeDiffInterval)
})
</script>
