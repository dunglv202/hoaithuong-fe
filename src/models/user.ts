export interface User {
  displayName?: string
  avatar?: string
}

export interface UserConfigs {
  reportSheetId: string
}

export interface DetailProfile extends User {
  configs: UserConfigs
}

export interface UpdatedDetailProfile {
  configs: UserConfigs
}
