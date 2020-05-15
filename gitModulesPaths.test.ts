import {gitModulesPaths} from './gitModulesPaths'

it('empty', () => expect(gitModulesPaths(`
`)).toStrictEqual([
]))

it('1 path', () => expect(gitModulesPaths(
  'path=patterning'
)).toStrictEqual([
  'patterning'
]))

it('.gitmodules', () => expect(gitModulesPaths(`
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