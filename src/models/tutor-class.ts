import type { Weekday } from './common'

export interface TutorClass {
  id: number
  code: string
  student: {
    id: number
    name: string
  }
  level: string
  totalLecture: number
  learned: number
  notes?: string
  active: boolean
}

export interface Timeslot {
  weekday: Weekday
  startTime: string
}

export interface NewTutorClass {
  code: string
  studentId?: number
  level: string
  totalLecture: number
  learned?: number
  notes?: string
  schedule: Timeslot[]
  durationInMinute?: number
  payForLecture?: number
}
