import { type DetailProfile, type UpdatedDetailProfile } from '@/models/user'
import axios from 'axios'

export const getDetailProfile = async () => {
  return (await axios.get<DetailProfile>('/api/me/profile')).data
}

export const updateDetailProfile = async (profile: UpdatedDetailProfile) => {
  return (await axios.put<DetailProfile>('/api/me/profile', profile)).data
}
