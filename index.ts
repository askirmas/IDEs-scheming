#!/usr/bin/env node
import { dirname, join, resolve } from 'path' 
import { ajv } from './ajv'
import { globby } from './globby'
import { readJson } from './readJson'
import { units, notEachUnitShouldHaveSchema } from './scheming.config.json'
import { patterns } from "./vscode/parameters.json"
import { iVsCodeSchemaEntry, iVsCodeWorkSpace, iVsCodeSettings } from './defs'

const key = 'json.schemas' as const

export default checker
export {
  checker
}

if (module.parent === null)
  checker()
  .then(r => {
    if (r === true)
      process.exit(0)

    console.error(r)
    process.exit(1)
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })

async function checker() {
  //TODO Unused schemas
  const jsons2Check = new Set(
    notEachUnitShouldHaveSchema
    ? []
    : await globby(units)
  )
  //vscodeTasks()
  , tasks: Map<string, [string, iVsCodeSchemaEntry[]]> = new Map(await Promise.all([
      ...(await globby(patterns.workspace))
      .map(async filename => [
        filename,
        [
          dirname(filename),
          (await readJson(patterns.workspace, filename) as iVsCodeWorkSpace)
          //TODO .folders
          .settings?.[key]  
        ]
      ] as [string, [string, iVsCodeSchemaEntry[]]]),
      ...(await globby(patterns.settings))
      .map(async filename => [
        filename, 
        [
          join(dirname(filename), '..'),
          (await readJson(patterns.settings, filename) as iVsCodeSettings)
          [key]
        ]
      ] as [string, [string, iVsCodeSchemaEntry[]]])
  ]))

  for (const [source, [subfolder, entries]] of tasks) {
    if (!entries)
      continue

    let index = -1
    for (const {fileMatch, schema, url} of entries) {      
      index++
      const scope = {source, index} 
      if (url === undefined && schema === undefined)
        throw {...scope, message: "Both `url` and `schema` are empty"}

      const $id = await registerSchema(url, source, index, subfolder, schema)
      throwIfError(ajv, scope)

      Object.assign(scope, {$schema: $id})

      if (!(fileMatch && fileMatch.length))
        throw {...scope, message: "Empty `fileMatch`"}

      for (const filePattern of fileMatch) {
        const files = await globby(filePattern, {cwd: subfolder})
        if (!files.length)
          throw {...scope, filePattern, message: "No files was found"}
  
        for (const filename of files) {
          jsons2Check.delete(filename)
          
          if (!validate(await readJson('fileValidation', filename) as any, $id))
            throwIfError(ajv, {...scope,  filename})      
        }  
      }
    }
  }

  //TODO try get internal `$schema`
  if (jsons2Check.size)
    throw {
      "message": "Not all jsons checked with",
      "data": jsons2Check
    }
  return true
}


async function registerSchema(url: string|undefined, source: string, index: number, subfolder: string, schema: any) {
  const $id = url === undefined 
  ? `${source}:${index}`
  : url.startsWith('http')
  ? url 
  : resolve(subfolder, url)

  if (ajv.getSchema($id) === undefined)
    await ajv.compileAsync({
      ...schema ?? await readJson('compile', $id),
      $id
    })

  return $id
}

function validate(data: any, $id: string) {
  if (data !== null && typeof data === 'object')
    // TODO and this schema
    delete data.$schema
  return ajv.validate($id, data)
}

function throwIfError({errors}: {errors?: any}, scope: any) {
  if (errors)
    throw {...scope, error: ajv.errorsText(errors, {}), errors}
}
