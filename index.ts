#!/usr/bin/env node
import fs from 'fs'
import glob from 'glob'
//import xml2js from 'xml2js'
import defaultOptions from './config.json'
import { iValidator, iScope, iVsCodeWorkSpace, iVsCodeSettings, iErrorText/*, iIdeaSettings*/ } from './defs.js'

/*const xmlParser = new xml2js.Parser()
xmlParser.parseString(
  fs.readFileSync('./.idea/jsonSchemas.xml'),
  (err: any, res?: iIdeaSettings) => {       
    console.log(JSON.stringify(
      err || res!.project.component[0].state[0].map[0].entry[0].value[0].SchemaInfo
    ))
  }
)
*/
if (typeof require !== 'undefined' && require.main === module) {
  let result: any = true
  try {
    result = main()
  } catch (e) {
    result = e
  } finally {
    if (result === true)
      process.exit(0);
    console.error(`\x1b[31m${result}\x1b[m`)
    process.exit(1)
  }
}

export default function main(
  options = {},
  ajv = (
    new (require(defaultOptions.interpreter.ref))(defaultOptions.interpreter.opts)
  )/* // AJV- Not required if this one first use as data and as schema only afterwards
  .addMetaSchema(
    require('./schemas/draft04-strict.json')
  )*/
) {
  const opts = Object.assign({}, defaultOptions, options || {})
  , {ignore, wsPattern, settingsPath, listPattern} = opts,
  fileList = new Set(glob.sync(listPattern, {ignore}))

  let validateEntriesPacks = glob.sync(wsPattern)
  .map(wsPath =>
    fs.existsSync(wsPath)
    && (<iVsCodeWorkSpace>readJson(wsPath)).settings
  )
  
  validateEntriesPacks.push(
    fs.existsSync(settingsPath)
    && <iVsCodeSettings>readJson(settingsPath)
  )

  validateEntriesPacks = validateEntriesPacks
  .filter(x => x && typeof x === 'object' && x['json.schemas'])
  
  const result = validateEntriesPacks.length === 0 
  ? 'No IDE settings was found'
  : (
    <iVsCodeSettings[]>
    validateEntriesPacks
    .filter(x => x && typeof x === 'object' && x['json.schemas'])
  ).every(({"json.schemas": validateEntries}) => {
    return validateEntries.length === 0
    ? "Nothing to validate"
    : validateEntries
    //@ts-ignore
    .every(({fileMatch, url}) => {
      if (url.startsWith('http')) {
        console.warn('Schemas by URL is not supported yet')
        return true
      }
      
      return validateBySchema(
        fileMatch,
        url,
        ignore,
        ajv.compile(readJson(url)),
        e => ajv.errorsText(e),
        fileList
      )
    })
  })
  
  return result && (
    fileList.size === 0
    || `These JSONs have no schema:\n${
      [...fileList.values()].join("\n")
    }`
  )
}


function validateBySchema(
  patterns: string[],
  $schema: string,
  ignore: string | string[],
  validate: iValidator,
  errorsText: iErrorText,
  fileList: Set<string>
) {
  return patterns.every(pattern => {
    const paths = glob.sync(
      vs2globpattern(pattern),
      { ignore }
    )
    
    if (paths.length === 0)
      throw `No files under ${pattern}`

    return paths.every(path => validateObject(
      path,
      validate,
      { fileList, $schema, pattern, path },
      errorsText
    ))
  })
}

function validateObject(
  path: string,
  validate: iValidator,
  {fileList, ...scope}: Partial<iScope> = {},
  errorsText: iErrorText
) {
  if (!validate(readJson(path)))
    throw [
      `#Schema.Error: ${errorsText(validate.errors)}`,
      ...Object.entries(scope)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    ].join("\n")

  fileList && fileList.delete(path.replace(/^\.\//, ''))
  return true
}

function readJson(path: string) :object {
  try {
    return JSON.parse(
      //@ts-ignore Argument of type 'Buffer' is not assignable to parameter of type 'string'.ts(2345)
      fs.readFileSync(path)
    )
  } catch (e) {
    throw `${path}:\n${e}`
  }
}

function vs2globpattern(pattern: string) {
  return pattern.includes('/')
  ? pattern
  : `**/${pattern}` 
}