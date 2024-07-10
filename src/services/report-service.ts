import axios from 'axios'

export const exportXlsx = async ({ year, month }: { year: number; month: number }) => {
  const resp = await axios.get('/api/reports/export', {
    params: { year, month },
    responseType: 'blob'
  })
  const url = URL.createObjectURL(new Blob([resp.data]))
  const link = document.createElement('a')
  link.href = url
  link.download = 'report.xlsx'
  link.click()
  URL.revokeObjectURL(url)
}
