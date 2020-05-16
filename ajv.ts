import Ajv from 'ajv'
import fetch from 'node-fetch'
import { with$id } from './defs'

const ajv = new Ajv({
  "schemaId": "auto",
  "extendRefs": true,
  "jsonPointers": true,
  "allErrors": true,
  "verbose": true,
  "ownProperties": true,
  loadSchema,
  //TODO Check these parameters
  // addUsedSchema: true,
  // async: true,
  // inlineRefs: true,
  // logger: console,
  // loopRequired: Infinity,
  // meta: true,
  // missingRefs: "fail",
  // serialize: false,
  // sourceCode: true,
  // transpile: "require",
})

export { ajv }

//TODO `schema` couldn't be `:boolean` yet
async function loadSchema(uri: string)  {
  const schema = (await
    (uri.startsWith('http://') || uri.startsWith('https://')) 
    ? fetch(uri).then(b => b.json())
    : require(uri)
  ) as with$id

  schema.$id = uri

  return schema
}
