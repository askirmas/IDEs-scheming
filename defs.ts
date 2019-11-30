export type iVsCodeSettings = {
  'json.schemas': {fileMatch: string[], url: string}[]
}
export type iVsCodeWorkSpace = {
  "settings": iVsCodeSettings
}

export type iValidator_ = (o: object) => boolean;
export interface iValidator extends iValidator_ {
  errors: any
}
export type iErrorText = (errors: any) => string

export type iScope = {
  fileList: Set<string>
  [k: string]: any
}
