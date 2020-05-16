import globby from 'globby'

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
  return globby(
    patterns,
    {
      ...globbyOpts,
      ...opts
    } 
  )
}
