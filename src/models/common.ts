export interface Option<V> {
  label: string
  value: V
}

export type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'

export const weekdays: Option<Weekday>[] = [
  { label: 'Monday', value: 'MON' },
  { label: 'Tuesday', value: 'TUE' },
  { label: 'Wednesday', value: 'WED' },
  { label: 'Thursday', value: 'THU' },
  { label: 'Friday', value: 'FRI' },
  { label: 'Saturday', value: 'SAT' },
  { label: 'Sunday', value: 'SUN' }
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
