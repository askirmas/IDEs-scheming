import { g } from "./g"
import { patterns } from './parameters.json'
import { readJson } from "./readJson"
import { iVsCodeWorkSpace, iVsCodeSettings, iTask } from "./defs"
import { dirname, basename } from "path"

const {
  vscode: {
    settings, workspace
  }
} = patterns

export {
  vscodeTasks
}

async function vscodeTasks(cwd?: string) {
  const opts = {
    cwd,
    //Due to https://github.com/sindresorhus/globby/issues/133
    gitignore: false
  }
  , [wsFiles, setFiles] = await Promise.all(
    [workspace, settings]
    .map(p => g(p, opts))
  )
  , tasks: iTask[] = [];
  
  (await Promise.all(
    wsFiles
    .map((source, index) =>
      (readJson(vscodeTasks.name, source) as Promise<iVsCodeWorkSpace>)
      //TODO *.code-workspace:`.folder[@].path`.forEach(cwdNext => vscodeTasks(`${cwd}/${cwdNext}`))
      .then(({settings}) => settings && [
        settings,
        dirname(source),
        basename(source),
        index
      ] as const)
    ).concat(
      setFiles
      .map((source, index) =>
        (readJson(vscodeTasks.name, source) as Promise<iVsCodeSettings>)
        .then(settings => settings && [
          settings,
          dirname(dirname(source)),
          '.vscode/settings.json',
          index
        ] as const)
      )
    )
  )).forEach(set => {
    if (!set)
      return;
    const [settings, cwd, source, index] = set
    , records = settings["json.schemas"] as undefined | typeof tasks
    , meta = {source, index, cwd}
    if (!records)
      return
    records.forEach(record => Object.assign(record, meta))
    tasks.push(...records)
  })
  
  return tasks
}
