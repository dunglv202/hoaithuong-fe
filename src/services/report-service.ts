import type { Report, ReportRange } from '@/models/report'
import axios from 'axios'

export const downloadReport = async ({ year, month }: { year: number; month: number }) => {
  const url = `/api/reports/download?year=${year}&month=${month}`
  const link = document.createElement('a')
  link.href = url
  link.download = ''
  link.click()
}

export const exportReport = async ({ year, month }: { year: number; month: number }) => {
  await axios.post('/api/reports/export', null, {
    params: { year, month },
    fetchOptions: { selfHandle: true }
  })
}

export const getReport = async (range: ReportRange) => {
  const resp = await axios.get<Report>('/api/reports', { params: range })
  return resp.data
}
