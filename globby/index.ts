import globby from 'globby'
import { resolve } from 'path'

type GlobbyOptions = Parameters<typeof globby>[1]

const globbyOpts: GlobbyOptions = {
  "gitignore": true,
  "ignore": [
    "tsconfig.json",
    "package.json",
    "package-lock.json"
  ],  
  "dot": true,
  "suppressErrors": true,
  "absolute": true  
}

export {
  g as globby
}

function g(patterns: Parameters<typeof globby>[0], opts?: GlobbyOptions) {
  //Due to https://github.com/sindresorhus/globby/issues/133
  const {absolute, ...o} = {...globbyOpts, ...opts}
  , cwd = o.cwd ?? process.cwd()
  , $return = globby(patterns, o)
  return (!absolute)
  ? $return
  : $return.then(filenames =>
    filenames.map(filename => resolve(cwd, filename))
  )
}
