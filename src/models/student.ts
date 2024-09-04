import type { Option } from './common'

export type Salutation = 'MR' | 'MRS'

export const salutations: Option<Salutation>[] = [
  { value: 'MR', label: 'Mr' },
  { value: 'MRS', label: 'Mrs' }
]

export interface Person {
  salutation: Salutation
  name: string
}

export interface Student {
  id: number
  name: string
  reportTo: Person
  notes?: string
  active: boolean
}

export interface MinimalStudent {
  id: number
  name: string
}

export interface NewStudent {
  name: string
  reportTo: Person
  notes?: string
}

export interface UpdatedStudent {
  name: string
  reportTo: Person
  notes?: string
}
