import type { Range } from '@/models/common'
import type { Schedule } from '@/models/schedule'
import axios from 'axios'

export const getSchedule = async (range: Range<Date>) => {
  const resp = await axios.get<Schedule[]>('/api/schedule', {
    params: {
      from: range.from.toISOString().slice(0, 10),
      to: range.to.toISOString().slice(0, 10)
    }
  })
  return resp.data
}
