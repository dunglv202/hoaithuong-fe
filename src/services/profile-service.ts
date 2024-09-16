import type { Calendar } from '@/models/calendar'
import axios from 'axios'

export const getListCalendars = async () => {
  return (await axios.get<Calendar[]>('/api/me/calendars')).data
}
