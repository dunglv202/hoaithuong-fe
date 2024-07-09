import type { NewStudent, Student } from '@/models/student'
import axios from 'axios'

export const addStudent = async (student: NewStudent) => {
  await axios.post('/api/students', student)
}

export const fetchStudents = async () => {
  return (await axios.get('/api/students')).data as Student[]
}
