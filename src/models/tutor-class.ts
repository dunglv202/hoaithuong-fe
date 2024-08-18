import type { Weekday } from './common'
import type { Student } from './student'

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
  timeSlots: Timeslot[]
  durationInMinute?: number
  payForLecture?: number
  startDate?: Date
}

export interface DetailClass {
  id: number
  code: string
  student: Student
  level: string
  notes?: string
  totalLecture: number
  learned: number
  durationInMinute: number
  payForLecture: number
  timeSlots: Timeslot[]
  active: boolean
}

export interface UpdatedClass {
  code: string
  level: string
  notes?: string
  timeSlots: Timeslot[]
  payForLecture?: number
  startDate?: Date
}
