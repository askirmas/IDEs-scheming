#!/usr/bin/env node
import { dirname, join, resolve } from 'path' 
import { ajv } from './ajv'
import { g } from './g'
import { readJson } from './readJson'
import { units, notEachUnitShouldHaveSchema } from './scheming.config.json'
import { patterns } from "./parameters.json"
import { iVsCodeSchemaEntry, iVsCodeWorkSpace, iVsCodeSettings } from './defs'

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
    : await g(units)
  )
  , tasks: Map<string, [string, iVsCodeSchemaEntry[]]> = new Map(await Promise.all([
      ...(await g(patterns.vscode.workspace))
      .map(async filename => [
        filename,
        [
          dirname(filename),
          (await readJson(patterns.vscode.workspace, filename) as iVsCodeWorkSpace)
          //TODO .folders
          .settings?.['json.schemas']  
        ]
      ] as [string, [string, iVsCodeSchemaEntry[]]]),
      ...(await g(patterns.vscode.settings))
      .map(async filename => [
        filename, 
        [
          join(dirname(filename), '..'),
          (await readJson(patterns.vscode.settings, filename) as iVsCodeSettings)
          ["json.schemas"]
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
      
      const $id = url === undefined 
      ? `${source}:${index}`
      : url.startsWith('http')
      ? url 
      : resolve(subfolder, url)
      
      Object.assign(scope, {$schema: $id})

      if (ajv.getSchema($id) === undefined) {
        await ajv.compileAsync(
          {
            ...schema ?? await readJson('compile', $id),
            $id
          }
        )
        throwIfError(ajv, scope)
      }

      if (!(fileMatch && fileMatch.length))
        throw {...scope, message: "Empty `fileMatch`"}

      for (const filePattern of fileMatch) {
        const files = await g(filePattern, {cwd: subfolder})
        if (!files.length)
          throw {...scope, filePattern, message: "No files was found"}
  
        for (const filename of files) {
          jsons2Check.delete(filename)
          const data = await readJson('validate', filename) as any
          if (data !== null && typeof data === 'object')
            // TODO and this schema
            delete data.$schema
          if (!ajv.validate($id!, data))
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


function throwIfError({errors}: {errors?: any}, scope: any) {
  if (errors)
    throw {...scope, error: ajv.errorsText(errors, {}), errors}
}
