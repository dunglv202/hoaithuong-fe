import type { Lecture } from './lecture'

export interface ReportRange {
  year: number
  month: number
}

export interface Report {
  totalEarned: number
  estimatedTotal: number
  totalLectures: number
  totalStudents: number
  lectures: Lecture[]
}

export interface SheetExportResult {
  url: string
}
