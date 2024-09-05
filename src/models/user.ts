export interface User {
  displayName?: string
  avatar?: string
}

export interface UserConfigs {
  generalReportUrl: string
  generalReportSheet: string
  detailReportUrl: string
  detailReportSheet: string
}

export interface DetailProfile extends User {
  configs: UserConfigs
}

export interface UpdatedDetailProfile {
  configs: UserConfigs
}

export interface UpdateAvatarResp {
  url: string
}
