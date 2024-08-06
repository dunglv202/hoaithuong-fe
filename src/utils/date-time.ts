export const SECOND = 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR
export const WEEK = 7 * DAY
export const MONTH = 30 * DAY
export const YEAR = 365 * DAY

export const formatAsDiff = (date: Date) => {
  const diff = Date.now() - date.getTime()
  if (diff < MINUTE) {
    return 'Just now'
  }
  if (diff < HOUR) {
    return `${Math.floor(diff / MINUTE)}m ago`
  }
  if (diff < DAY) {
    return `${Math.floor(diff / HOUR)}h ago`
  }
  if (diff < WEEK) {
    return `${Math.floor(diff / DAY)}d ago`
  }
  if (diff < MONTH) {
    return `${Math.floor(diff / WEEK)}w ago`
  }
  if (diff < YEAR) {
    return `${Math.floor(diff / MONTH)}mo ago`
  }
  return `${Math.floor(diff / YEAR)}y ago`
}
