export interface Option<V> {
  label: string
  value: V
}

export type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export const weekdays: Option<Weekday>[] = [
  { label: 'Monday', value: 'MONDAY' },
  { label: 'Tuesday', value: 'TUESDAY' },
  { label: 'Wednesday', value: 'WEDNESDAY' },
  { label: 'Thursday', value: 'THURSDAY' },
  { label: 'Friday', value: 'FRIDAY' },
  { label: 'Saturday', value: 'SATURDAY' },
  { label: 'Sunday', value: 'SUNDAY' }
]

export const times: Option<string>[] = []
for (let hour = 8; hour <= 22; hour++) {
  for (let minute = 0; minute < 60; minute += 10) {
    const h = hour.toString().padStart(2, '0')
    const m = minute.toString().padStart(2, '0')
    times.push({
      label: `${h}:${m}`,
      value: `${h}:${m}`
    })
  }
}

export interface Range<T> {
  from: T
  to: T
}

export interface ApiError {
  code?: string
  error?: string
}

export interface Page<T> {
  totalPages: number
  content: T[]
}

export interface Pagination {
  page?: number
  size?: number
}

export interface FutureUpdate {
  effectiveDate: Date | string
}

export type Appearance = 'light' | 'dark'
export type ThemeConfig = 'LIGHT' | 'DARK' | 'SYSTEM'
