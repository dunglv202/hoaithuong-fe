import {
  type DetailClass,
  type NewTutorClass,
  type TutorClass,
  type UpdatedClass
} from '@/models/tutor-class'
import axios from 'axios'

interface TutorClassCriteria {
  keyword?: string
  active?: boolean
}

export const addTutorClass = async (tutorClass: NewTutorClass) => {
  await axios.post('/api/tutor_classes', tutorClass)
}

export const fetchTutorClasses = async (criteria?: TutorClassCriteria) => {
  const configs = criteria ? { params: criteria } : undefined
  return (await axios.get('/api/tutor_classes', configs)).data as TutorClass[]
}

export const getDetailClass = async (id: number) => {
  return (await axios.get<DetailClass>(`/api/tutor_classes/${id}`)).data
}

export const updateTutorClass = async (id: number, tutorClass: UpdatedClass) => {
  await axios.put(`/api/tutor_classes/${id}`, { ...tutorClass, id })
}
