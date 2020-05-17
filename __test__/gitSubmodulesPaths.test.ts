import {gitSubmodulesPaths} from '../src/globby/gitSubmodulesPaths'

it('empty', () => expect(gitSubmodulesPaths(`
`)).toStrictEqual([
]))

it('1 path', () => expect(gitSubmodulesPaths(
  'path=patterning'
)).toStrictEqual([
  'patterning'
]))

it('.gitmodules', () => expect(gitSubmodulesPaths(`
[submodule "patterning"]\n
	path = patterning  \n
  url = https://github.com/askirmas/patterning.git\n
[submodule "azure/syncer/azure-resource-manager-schemas"]\n
	path = azure/syncer/azure-resource-manager-schemas\n
	url = https://github.com/Azure/azure-resource-manager-schemas.git\n
`)).toStrictEqual([
  "patterning",
  "azure/syncer/azure-resource-manager-schemas"
]))