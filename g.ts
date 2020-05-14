import globby, { GlobbyOptions } from 'globby'
import {globby as globbyOpts} from './scheming.config.json'

export {
  g
}

function g(patterns: Parameters<typeof globby>[0], opts?: Parameters<typeof globby>[1]) {
  return globby(
    patterns,
    {
      ...globbyOpts as GlobbyOptions,
      ...opts
    } 
  )
}
