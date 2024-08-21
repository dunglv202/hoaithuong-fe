import type { Lecture, ScheduleLecture } from './lecture'
import type { ScheduleClass, TutorClass } from './tutor-class'

export interface Schedule {
  id: number
  startTime: string
  endTime: string
  tutorClass: TutorClass
  lecture?: Lecture
}

export interface MinimalSchedule {
  id: number
  startTime: string
  endTime: string
  tutorClass: ScheduleClass
  lecture?: ScheduleLecture
}
