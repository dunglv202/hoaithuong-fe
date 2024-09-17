import type { Range } from '@/models/common'
import type { MinimalSchedule, NewSchedule } from '@/models/schedule'
import axios from 'axios'
import moment from 'moment'

export const getSchedule = async (range: Range<Date>) => {
  const resp = await axios.get<MinimalSchedule[]>('/api/schedule', {
    params: {
      from: range.from.toISOString().slice(0, 10),
      to: range.to.toISOString().slice(0, 10)
    }
  })
  return resp.data
}

export const addSchedule = async (schedule: NewSchedule) => {
  await axios.post('/api/schedule', {
    ...schedule,
    startTime: moment(schedule.startTime).format('yyyy-MM-DD HH:mm:ss')
  })
}

export const deleteSchedule = async (id: number) => {
  await axios.delete(`/api/schedule/${id}`)
}

export const syncToGoogleCalendar = async (range: Partial<Range<Date>>) => {
  await axios.post('/api/schedule/sync_calendar', {
    from: moment(range.from).format('YYYY-MM-DD'),
    to: range.to ? moment(range.to).format('YYYY-MM-DD') : undefined
  })
}
