import { resolve } from 'path'
import { ajv } from '../src/ajv'

const r = (...chunks: string[]) => resolve(__dirname, ...chunks)
, $schemas = [
  r('../__specs__/refs/record.schema.json'),
  'https://askirmas.github.io/jest.schema.json'
]

describe($schemas[0], () => {
  const $schema = $schemas[0]
  beforeAll(() => ajv.compileAsync({$ref: $schema}))

  it('true', () => expect(ajv.validate($schema, {
  })).toBe(
    true
  ))

  it('false', () => expect(ajv.validate($schema, {
    "xxx": "yyy"
  })).toBe(
    false
  ))
})

describe($schemas[1], () => {
  const $schema = $schemas[1]

  beforeAll(() => ajv.compileAsync({$ref: $schema}))  

  it('./jest.config.json', () => expect(ajv.validate($schema, 
    require('../jest.config.json')
  )).toBe(true))
})