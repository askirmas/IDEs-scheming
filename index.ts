#!/usr/bin/env node
import fs from 'fs'
import glob from 'glob'

interface iVsCode {
  'json.schemas': {fileMatch: string[], url: string}[]
}

const wsPattern = '*.code-workspace'
, settingsPath = '.vscode/settings.json'


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

// Check all json's

/**
* @param {string}path 
*/
export default function main(
  ajv = (
    new (require('ajv'))(
      {schemaId: 'auto'}
    )
  )/* // Not required if this one first use as data and as schema only afterwards
  .addMetaSchema(
    require('./schemas/draft04-strict.json')
  )*/,
  //TODO: read .gitignore and etc stuff
  ignore: string | string[] = "node_modules/**"
) {

  let validateEntriesPacks = glob.sync(wsPattern)
  .map(wsPath => fs.existsSync(wsPath) && readJson(wsPath).settings)
  
  validateEntriesPacks.push(fs.existsSync(settingsPath) && readJson(settingsPath))

  validateEntriesPacks = validateEntriesPacks
  .filter(x => x && typeof x === 'object' && x['json.schemas'])
  
  return validateEntriesPacks.length === 0 
  ? 'No IDE settings was found'
  : validateEntriesPacks
  .filter(x => x && typeof x === 'object' && x['json.schemas'])
  .every(({"json.schemas": validateEntries}) => {
    return validateEntries.length === 0
    ? "Nothing to validate"
    : validateEntries
    //@ts-ignore
    .every(({fileMatch, url}) => {
      if (url.startsWith('http')) {
        console.warn('Schemas by URL is not supported yet')
        return true
      }
      return validateBySchema(fileMatch, url, ignore, ajv.compile(readJson(url)), e => ajv.errorsText(e))
    })
  })
}


type iValidator_ = (o: object) => boolean;
interface iValidator extends iValidator_ {
  errors: any
}
type iErrorText = (errors: any) => string


function validateBySchema(patterns: string[], $schema: string, ignore: string | string[], validate: iValidator, errorsText: iErrorText) {
  return patterns.every(pattern => {
    const paths = glob.sync(
      vs2globpattern(pattern),
      { ignore }
    )
    
    if (paths.length === 0)
      throw `No files under ${pattern}`

    return paths.every(path => validateObject(
      readJson(path),
      validate,
      { $schema, pattern, path },
      errorsText
    ))
  })
}

function validateObject(content: object, validate: iValidator, scope: {}, errorsText: iErrorText) {
  if (!validate(content))
    throw [
      `#Schema.Error: ${errorsText(validate.errors)}`,
      JSON.stringify(scope)
    ].join("\n")
  return true
}

function readJson(path: string) {
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