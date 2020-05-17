export { iVsCodeWorkSpace, iVsCodeSettings, iVsCodeSchemaEntry, i$id, iTask } 

type iTask
= {
  source: string
  cwd: string
  index: number
}
& iVsCodeSchemaEntry

type iVsCodeSchemaEntry = Partial<{
  "fileMatch": string[]
  "url": string
  "schema": any
}>

type iVsCodeSettings = Partial<{
  "json.schemas": iVsCodeSchemaEntry[]
}>

type iVsCodeWorkSpace = Partial<{
  "folders": Array<{
    "path": string
  }>
  "settings": iVsCodeSettings
}>

type i$id = {$id: string}