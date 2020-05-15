export {
  gitModulesPaths as gitModulesPaths
}

function gitModulesPaths(content: string) {
  //TODO check path with spaces
  const parser = /^\s*path\s*=\s*(.+)$/gm
  , $return: string[] = []
  let result
  while (result = parser.exec(content), result) 
    $return.push(result[1].trim())
  return $return
}