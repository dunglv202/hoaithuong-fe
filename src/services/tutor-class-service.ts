import type { NewTutorClass, TutorClass } from '@/models/tutor-class'
import axios from 'axios'

export const addTutorClass = async (tutorClass: NewTutorClass) => {
  await axios.post('/api/tutor_classes', tutorClass)
}

export const fetchTutorClasses = async (keyword: string) => {
  return (await axios.get('/api/tutor_classes', { params: { keyword } })).data as TutorClass[]
}
