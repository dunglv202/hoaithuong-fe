export const exportXlsx = async ({ year, month }: { year: number; month: number }) => {
  const url = `/api/reports/export?year=${year}&month=${month}`
  const link = document.createElement('a')
  link.href = url
  link.download = ''
  link.click()
}
