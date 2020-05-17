import { readAsJson } from "../src/readAsJson";

describe(readAsJson.name, () => {
  it('ENOENT', () => expect(readAsJson(
    'ENOENT'
  )).rejects.toThrow())
  it('src/config.schema.json', () => expect(readAsJson(
    'src/config.schema.json'
  )).resolves.toMatchObject({}))
})