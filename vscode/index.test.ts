import { vscodeTasks } from ".";
import Ajv from 'ajv'
import schema from '../itasks.schema.json'

const specDataDir = '__specs__'
, suites = [
  [undefined, 4],
  [`${specDataDir}/true`, 4],
  [`${specDataDir}/at_settings`, 3],
  [`${specDataDir}/at_settings2`, 3],
] as const
, ajv = new Ajv({allErrors: true})
, validator = ajv.compile(schema)

describe(vscodeTasks.name, () => {
  for (const [folder, length] of suites)
    it(folder ?? '$cwd', async () => {
      const output = await vscodeTasks(folder)  
      expect(output).toHaveLength(length)
      expect(validator(output)).toBe(true)
    })
})
