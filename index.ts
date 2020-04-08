#!/usr/bin/env node
import globby, { GlobbyOptions } from 'globby'
import {readFile} from 'fs'
import {dirname, join, resolve} from 'path' 
import Ajv, { Options } from 'ajv'
import fetch from 'node-fetch'

import $default, {patterns} from './config.json'
import { iVsCodeSchemaEntry, iVsCodeWorkSpace, iVsCodeSettings, with$id } from './defs'

const ajvOpts: Options = {
  "schemaId": "auto",
  "extendRefs": true,
  "jsonPointers": true,
  "allErrors": true,
  "verbose": true,
  "loadSchema": async uri =>  {
    //TODO move to readJson
    if (uri.startsWith('http'))
      return fetch(uri).then(r => r.json())
    
    const schema = await readJson("loadSchema", uri) as with$id
    , {$id} = schema

    schema.$id = $id && $id.startsWith('.') ? $id : uri
    return schema
  }
}
, globOpts: GlobbyOptions = {
  gitignore: !$default.withoutGitIgnore,
  ignore: $default.ignore,
  dot: true,
  suppressErrors: true,
  absolute: true
} 
, ajv = new Ajv(ajvOpts)
, g = (pattern: Parameters<typeof globby>[0], cwd?: string) => globby(
  pattern, {
    cwd,
    ...globOpts
  })

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
  const jsons2Check = new Set(
    $default.notEachJsonShouldHaveSchema
    ? []
    : await g(patterns.json)
  )
  , tasks: Map<string, [string, iVsCodeSchemaEntry[]]> = new Map(await Promise.all([
      ...(await g(patterns.workSpace))
      .map(async filename => [
        filename,
        [
          dirname(filename),
          (await readJson(patterns.workSpace, filename) as iVsCodeWorkSpace)
          //TODO .folders
          .settings['json.schemas']  
        ]
      ] as [string, [string, iVsCodeSchemaEntry[]]]),
      ...(await g(patterns.settings))
      .map(async filename => [
        filename, 
        [
          join(dirname(filename), '..'),
          (await readJson(patterns.settings, filename) as iVsCodeSettings)
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
        const files = await g(filePattern, subfolder)
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

  //TODO try get schema
  if (jsons2Check.size)
    throw {
      "message": "Not all jsons checked with",
      "data": jsons2Check
    }
  return true
}

function readJson(calledBy: string, filename: string) {
  return new Promise((res, rej) => 
    readFile(filename, (error, body) => {
      try {
        if (error)
          throw error
        res(
          //TODO jsonC
          JSON.parse(
            body.toString()
            .replace(
              /"(\$ref|\$schema)"\s*:\s*"(\.[^"]+)"/gs,
              (substring, $k, path?: string) =>
              !path
              ? substring
              :`"${$k}":"${resolve(dirname(filename), path)}"`
            )             
          )
        )
      }
      catch (error) {
        return rej({calledBy, filename, error})
      }
    })
  )
} 

function throwIfError({errors}: {errors?: any}, scope: any) {
  if (errors)
    throw {...scope, error: ajv.errorsText(errors, {}), errors}
}