export interface Student {
  id: number
  name: string
  notes?: string
  active: boolean
}

export interface MinimalStudent {
  id: number
  name: string
}

export interface NewStudent {
  name: string
  notes?: string
}
