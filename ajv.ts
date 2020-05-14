import Ajv, { Options } from 'ajv'
import fetch from 'node-fetch'
import { readJson } from './readJson'
import { ajv as ajvOpts } from './parameters.json'
import { with$id } from './defs'

const ajv = new Ajv({...ajvOpts as Options, loadSchema})
export { ajv }

async function loadSchema(uri: string)  {
  //TODO move to readJson?
  if (uri.startsWith('http'))
    return fetch(uri).then(r => r.json())
  
  const schema = await readJson("loadSchema", uri) as with$id
  , {$id = ''} = schema
  
  if (typeof $id !== 'string' || !$id.startsWith('.'))
    schema.$id = uri

  return schema
}
