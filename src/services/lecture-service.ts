import type { NewLecture } from '@/models/lecture'
import axios from 'axios'

export const addNewLecture = async (newLecture: NewLecture) => {
  await axios.post('/api/lectures', newLecture)
}
