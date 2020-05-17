import { vscodeTasks } from ".";
import Ajv from 'ajv'
import schema from '../itasks.schema.json'

const specDataDir = '__specs__'
, suites = [
  [undefined, 4],
  [`alone_json`, 0],
  [`at_settings`, 4],
  [`code-workspace`, 6],
  [`code-workspace_2`, 6],
  [`refs`, 2],
] as const
, ajv = new Ajv({allErrors: true})
, validate = ajv.compile(schema)

describe(vscodeTasks.name, () => {
  for (const [folder, length] of suites)
    it(folder ?? '$cwd', async () => {
      const output = await vscodeTasks(
        folder === undefined
        ? undefined
        : `${specDataDir}/${folder}`
      ) 
      
      expect(output).toHaveLength(length)
      if (!validate(output))
        throw new Error(ajv.errorsText(validate.errors))
    })
})
