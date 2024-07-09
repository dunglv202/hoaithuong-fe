import type { Level } from '@/models/level'
import axios from 'axios'

export const fetchLevels = async () => {
  return (await axios.get('/api/levels')).data as Level[]
}
