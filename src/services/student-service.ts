import { type Page, type Pagination } from '@/models/common'
import type { NewStudent, Student } from '@/models/student'
import axios from 'axios'

export const addStudent = async (student: NewStudent) => {
  await axios.post('/api/students', student)
}

export const fetchStudents = async (keyword?: string, pagination?: Pagination) => {
  return (
    await axios.get<Page<Student>>('/api/students', {
      params: { ...pagination, keyword }
    })
  ).data
}
