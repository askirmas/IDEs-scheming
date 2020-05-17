import { globby } from "../src/globby";

describe(globby.name, () => {
  it('1', () => expect(globby(
    '/node_modules'
  )).resolves.toStrictEqual([
  ]))
})