import globby, { GlobbyOptions } from 'globby'
import {globby as globbyOpts} from './scheming.config.json'

export {
  g
}

function g(pattern: Parameters<typeof globby>[0], cwd?: string) {
  return globby(
    pattern,
    {
      ...globbyOpts,
      cwd
    } as GlobbyOptions
  )
}
