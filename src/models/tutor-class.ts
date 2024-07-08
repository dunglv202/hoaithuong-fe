export interface TutorClass {
  id: number
  code: string
  student: {
    id: number
    name: string
  }
  level: string
  learned: number
  active: boolean
  notes?: string
}
