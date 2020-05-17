import { globby } from "../globby"
import { patterns } from './parameters.json'
import { iVsCodeWorkSpace, iVsCodeSettings, iTask } from "../defs"
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
      .map(p => globby(p, {
        cwd,
        //Due to https://github.com/sindresorhus/globby/issues/133
        gitignore: false
      }))
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
        const records = settings[key] as undefined | typeof tasks
        , meta /*iTask*/ = {source: file, cwd}
        if (!records)
          continue
        records.forEach((record, index) => Object.assign(record,
          meta,
          {index}
        ))
        tasks.push(...records)
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
