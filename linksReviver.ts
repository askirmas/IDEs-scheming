import { resolve } from 'path'

const dataKeys2resolve = new Set(['$schema'])
, schemaKeys2resolve = new Set([...dataKeys2resolve, '$ref'])

export { 
  linksReviver,
  dataKeys2resolve, schemaKeys2resolve,
}


function linksReviver(cwd: string, keys2resolve: Set<string>) {
  return (k: string, v: any) => !(
      keys2resolve.has(k)
      && typeof v === 'string'
      && v[0] === '.'
    )
    ? v
    : resolve(cwd, v)
}