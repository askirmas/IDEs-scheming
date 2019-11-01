import fs from 'fs'
import glob from 'glob'

interface iCodeWorkspace {
  settings: {
    'json.schemas': {fileMatch: string[], url: string}[]
  }
}

if (typeof require !== 'undefined' && require.main === module) {
  try {
    main()
  } catch (e) {
    console.error(`\x1b[31m${e}\x1b[m`)
    process.exit(1)
  }
}

/**
* @param {string}path 
*/
export default function main(
  ajv = (new (require('ajv'))({schemaId: 'auto'})).addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json')),
  //TODO: read .gitignore and etc stuff
  ignore: string | string[] = "node_modules/**"
) {

  const wsPattern = '*.code-workspace'
  , wss = glob.sync(wsPattern)
  if (wss.length === 0)
    throw `No ${wsPattern} found`

  return wss.every(wsPath => {
    const ws : iCodeWorkspace = readJson(wsPath)
    if (!('settings' in ws && 'json.schemas' in ws.settings))
      throw `Nothing to validate in ${wsPath}`

    return ws.settings['json.schemas']
    .every(({fileMatch, url}) => {
      if (url.startsWith('http')) {
        console.warn('Schemas by URL is not supported yet')
        return true
      }

      const validate = ajv.compile(readJson(url))
      return fileMatch.every(pattern => {
        const paths = glob.sync(
          pattern.includes('/')
          ? pattern
          : `**/${pattern}`,
          { ignore }
        )
        
        if (paths.length === 0)
          throw `No files under ${pattern}`

        return paths.every(p => {
          if (!validate(readJson(p)))
            throw [
              `#Schema.Error: ${ajv.errorsText(validate.errors)}`,
              `path: ${p}`,
              `pattern: ${pattern}`,
              `schema: ${url}`
            ].join("\n")
          return true
        })
      })
    })
  })
}

function readJson(path: string) {
  try {
    return JSON.parse(
      //@ts-ignore
      fs.readFileSync(path)
      )
    } catch (e) {
      console.error(`${path}:\n${e}`)
      process.exit(1)
    }
  }