import type { Pagination } from '@/models/common'
import type { Notification } from '@/models/notification'
import axios from 'axios'

interface NotificationWrapper {
  totalUnread: number
  notifications: Notification[]
}

export const getNotifications = async (pagination?: Pagination) => {
  const resp = await axios.get<NotificationWrapper>('/api/notifications', { params: pagination })
  return resp.data
}

export const readAllNotifications = async () => {
  await axios.post('/api/notifications/read_all')
}

export const readNotification = async (id: number) => {
  await axios.post(`/api/notifications/${id}/read`)
}

export const markNotiAsResolved = async (id: number) => {
  await axios.post(`/api/notifications/${id}/resolve`)
}
