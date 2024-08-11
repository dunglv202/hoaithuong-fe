import { type Lecture, type NewLecture, type UpdatedLecture } from '@/models/lecture'
import type { ReportRange } from '@/models/report'
import axios from 'axios'
import moment from 'moment'

export const addNewLecture = async (newLecture: NewLecture) => {
  await axios.post('/api/lectures', {
    ...newLecture,
    startTime: moment(newLecture.startTime).format('yyyy-MM-DD HH:mm:ss')
  })
}

export const getLectures = async (range: ReportRange) => {
  const lectures = await axios.get<Lecture[]>('/api/lectures', { params: range })
  return lectures.data
}

export const updateLecture = async (lecture: UpdatedLecture) => {
  await axios.put(`/api/lectures/${lecture.id}`, lecture)
}
