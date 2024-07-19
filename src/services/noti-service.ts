import type { Notification } from '@/models/notification'
import axios from 'axios'

interface NotificationWrapper {
  totalUnread: number
  notifications: Notification[]
}

export const getNotifications = async () => {
  const resp = await axios.get<NotificationWrapper>('/api/notifications')
  return resp.data
}
