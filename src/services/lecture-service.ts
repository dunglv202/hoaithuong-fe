import { type Lecture, type NewLecture } from '@/models/lecture'
import type { ReportRange } from '@/models/report'
import axios from 'axios'

export const addNewLecture = async (newLecture: NewLecture) => {
  await axios.post('/api/lectures', newLecture)
}

export const getLectures = async (range: ReportRange) => {
  const lectures = await axios.get<Lecture[]>('/api/lectures', { params: range })
  lectures.data.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
  return lectures.data
}
