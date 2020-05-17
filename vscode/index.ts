import { globby } from "../globby"
import { patterns } from './parameters.json'
import { iVsCodeWorkSpace, iVsCodeSettings, iTask, iTaskMeta } from "../defs"
import { /*dirname, basename,*/ resolve } from "path"
import { readFile } from "fs"

const {parse} = JSON
, {
    workspace, settings
} = patterns
, key = 'json.schemas' as const
, vsEntries = [workspace, settings]

export {
  vscodeTasks
}

async function vscodeTasks(cwd?: string) {
  const cwds = [cwd ?? process.cwd()]
  , wsFiles: string[] = []
  , setFiles: string[] = []
  , vsFiles = [wsFiles, setFiles]
  , [wsFilesSet, setFilesSet, cwdsSet] = vsFiles.concat(cwds).map(f => new Set(f))
  , vsSets = [wsFilesSet, setFilesSet]
  , tasks: iTask[] = [];
  
  for (let i = 0; i < cwds.length; i++) {
    const cwd = cwds[i]
    , entries = await Promise.all(
      vsEntries
      .map(p => globby(p, {cwd}))
    )

    for (let e = entries.length; e--;) {
      const files = entries[e]
      for (let f = files.length; f--;) {
        const file = resolve(cwd, files[f])
        , arr = vsFiles[e]
        , set = vsSets[e]

        if (set.has(file))
          continue
        set.add(file)
        arr.push(file)

        const data = await readAsJson(file)
        let settings: iVsCodeSettings|undefined = undefined
        switch (e) {
          case 0:
            const {folders, settings: s} = data as iVsCodeWorkSpace
            settings = s
            if (!folders)
              break
            for (let i = folders.length; i--;) {
              const folder = resolve(cwd, folders[i].path)
              if (cwdsSet.has(folder))
                continue
              cwdsSet.add(folder)
              cwds.push(folder)
            }  
            break
          case 1:
            settings = data as iVsCodeSettings
            break
          default:
        }

        if (!settings)
          continue
        const records = settings[key]
        
        if (!records)
          continue

        for (let index = records.length; index--;) {
          const meta: iTaskMeta = {source: file, cwd, index}
          , record = records[index]
          , {fileMatch} = record
          , {length} = fileMatch
          , files: iTask["files"] = new Array(length)

          for (let i = length; i--;)
            files[i] = (await globby(fileMatch[i], {cwd, absolute: false}))
            .map(f => resolve(cwd, f))
          tasks.push({...record, ...meta, files})
        }
      }  
    }     
  }

  return tasks
}

function readAsJson(filename: string) {
  return new Promise((res, rej) =>
    readFile(filename, (err, content) =>
      err
      ? rej(err)
      : res(parse(content.toString()))
    )
  )
}
