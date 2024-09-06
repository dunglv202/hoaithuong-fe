import type { SpreadsheetInfo } from '@/models/sheet'
import { type DetailProfile, type UpdateAvatarResp, type UpdatedDetailProfile } from '@/models/user'
import axios from 'axios'

export const getDetailProfile = async () => {
  return (await axios.get<DetailProfile>('/api/me/profile')).data
}

export const updateDetailProfile = async (profile: UpdatedDetailProfile) => {
  return (await axios.put<DetailProfile>('/api/me/profile', profile)).data
}

export const uploadAvatar = async (file: File) => {
  return (await axios.postForm<UpdateAvatarResp>('/api/me/upload_avatar', { file })).data
}

export const getSpreadSheetInfo = async (url: string) => {
  return (await axios.get<SpreadsheetInfo>('/api/me/spreadsheets/info', { params: { url } })).data
}
