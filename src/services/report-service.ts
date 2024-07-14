import type { Report, ReportRange } from '@/models/report'
import axios from 'axios'

export const exportXlsx = async ({ year, month }: { year: number; month: number }) => {
  const url = `/api/reports/export?year=${year}&month=${month}`
  const link = document.createElement('a')
  link.href = url
  link.download = ''
  link.click()
}

export const getReport = async (range: ReportRange) => {
  const resp = await axios.get<Report>('/api/reports', { params: range })
  return resp.data
}
