export { iValidator, iScope, iVsCodeWorkSpace, iVsCodeSettings, iErrorText, iIdeaSettings } 

type iVsCodeSettings = {
  'json.schemas': {fileMatch: string[], url: string}[]
}
type iVsCodeWorkSpace = {
  "settings": iVsCodeSettings
}

type iValidator_ = (o: object) => boolean;
interface iValidator extends iValidator_ {
  errors: any
}
type iErrorText = (errors: any) => string

type iScope = {
  fileList: Set<string>
  [k: string]: any
}

type iIdeaSettings = {
  project: {
    component: Array<{
      state: Array<{
        map: Array<{
          entry: Array<{
            value: Array<{
              SchemaInfo: Array<{
                option: Array<
                  iIdeaLeaf & {
                  list?: Array<{
                    Item: Array<{
                      option: iIdeaLeaf[]
                    }>
                  }>
                }>
              }>
            }>
          }>
        }>        
      }>
    }>
  }
}

type iIdeaLeaf = {
  $: {
    name: string,
    value?: string
  }
}