export const extractSheetId = (url: string) => {
  const regex = /https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/
  const match = url.match(regex)
  if (!match) throw new Error('Invalid Google Sheets URL')
  return match[1]
}
