import { g } from "./g"
import { patterns } from './scheming.config.json'
import { readJson } from "./readJson"
import { iVsCodeWorkSpace, iVsCodeSettings, iTask } from "./defs"

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
      //TODO *.code-workspace:`.folder[@].path`
      .then(({settings}) => settings && [settings, source, index] as const)
    ).concat(
      setFiles
      .map((source, index) =>
        (readJson(vscodeTasks.name, source) as Promise<iVsCodeSettings>)
        .then(settings => settings && [settings, source, index] as const)
      )
    )
  )).forEach(set => {
    if (!set)
      return;
    const [settings, source, index] = set
    , records = settings["json.schemas"] as undefined | typeof tasks
    , meta = {source, index}
    if (!records)
      return
    records.forEach(record => Object.assign(record, meta))
    tasks.push(...records)
  })
  
  return tasks
}
