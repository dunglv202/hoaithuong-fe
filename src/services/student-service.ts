import type { NewStudent, Student } from '@/models/student'
import axios from 'axios'

export const addStudent = async (student: NewStudent) => {
  await axios.post('/api/students', student)
}

export const fetchStudents = async (keyword?: string) => {
  return (
    await axios.get('/api/students', {
      params: { keyword }
    })
  ).data as Student[]
}
