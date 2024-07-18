import type { Lecture } from './lecture'
import type { TutorClass } from './tutor-class'

export interface Schedule {
  id: number
  startTime: string
  endTime: string
  tutorClass: TutorClass
  lecture?: Lecture
}
