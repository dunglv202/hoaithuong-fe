import type { Student } from './student'

export interface NewLecture {
  classId: number
  startTime?: Date
  topic: string
  comment?: string
  notes?: string
  scheduleId?: number
}

export interface Lecture {
  id: number
  startTime: string
  endTime: string
  classCode: string
  student: Student
  topic: string
  lectureNo: number
  totalLecture: number
  comment?: string
  notes?: string
}

export interface UpdatedLecture {
  id: number
  topic: string
  comment?: string
  notes?: string
}

export interface ScheduleLecture {
  id: number
  topic: string
  comment?: string
  notes?: string
}
