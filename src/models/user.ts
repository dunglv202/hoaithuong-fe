import type { ThemeConfig } from './common'

export interface User {
  displayName?: string
  avatar?: string
}

export interface UserConfigs {
  themeApprearance?: ThemeConfig
  generalReportUrl?: string
  generalReportSheet?: string
  detailReportUrl?: string
  detailReportSheet?: string
}

export interface DetailProfile extends User {
  configs: UserConfigs
}

export interface UpdatedDetailProfile {
  displayName: string
  configs: UserConfigs
}

export interface UpdateAvatarResp {
  url: string
}
