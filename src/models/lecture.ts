import type { Student } from './student'

export interface NewLecture {
  classId: number
  startTime: Date
  topic: string
  notes?: string
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
}
