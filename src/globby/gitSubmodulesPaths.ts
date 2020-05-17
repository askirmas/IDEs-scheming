export {
  gitSubmodulesPaths as gitSubmodulesPaths
}

function gitSubmodulesPaths(content: string) {
  //TODO check path with spaces
  const parser = /^\s*path\s*=\s*(.+)$/gm
  , $return: string[] = []
  let result
  while (result = parser.exec(content), result) 
    $return.push(result[1].trim())
  return $return
}

/** //TODO with git-cli
 * git submodule status --recursive
 * Other ways are not working 
 * git submodule foreach --recursive --quiet 'echo $sm_path'
 * git submodule--helper list
 */