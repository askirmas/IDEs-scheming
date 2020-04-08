export { iVsCodeWorkSpace, iVsCodeSettings, iVsCodeSchemaEntry, with$id } 

type iVsCodeSchemaEntry = Partial<{
  "fileMatch": string[]
  "url": string
  "schema": any
}>

type iVsCodeSettings = {
  "json.schemas": iVsCodeSchemaEntry[]
}
type iVsCodeWorkSpace = {
  "folders": {
    "path": string
  }[]
  "settings": iVsCodeSettings
}
type with$id = {$id?: string}