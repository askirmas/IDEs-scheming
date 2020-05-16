import { resolve } from 'path'

const dataKeys2resolve = new Set(['$schema'])
, schemaKeys2resolve = new Set([...dataKeys2resolve, '$ref'])

export { 
  linksReviver,
  dataKeys2resolve, schemaKeys2resolve,
}


function linksReviver(
  cwd: string, keys2resolve: Set<string>, resolved: Set<string>
) :<T>(key: string, value: T) => T {
  return (k: string, v: any) => {
    if(!(
      keys2resolve.has(k)
      && typeof v === 'string'
      && v[0] === '.'
    ))
      return v
    const resolvedValue = resolve(cwd, v)
    resolved.add(resolvedValue)
    return resolvedValue
  }
}