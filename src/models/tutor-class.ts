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

export interface NewTutorClass {
  code: string
  studentId: number
  level: string
  totalLecture: number
  learned?: number
  notes?: string
  durationInMinute?: number
  payForLecture?: number
}
