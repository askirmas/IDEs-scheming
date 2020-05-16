import globby, { GlobbyOptions } from 'globby'
import {globby as globbyOpts} from '../parameters.json'

export {
  g as globby
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
