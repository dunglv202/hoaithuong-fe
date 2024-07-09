interface Token {
  value: string
  expiredAt: Date
}

export interface AuthResult {
  accessToken: Token
  refreshToken: Token
}
