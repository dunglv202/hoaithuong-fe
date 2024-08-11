type NotiType = 'RENEW_CLASS'

export interface Notification {
  id: number
  content: string
  read: boolean
  type?: NotiType
  payload?: any
  resolved: boolean
  timestamp: string
}
