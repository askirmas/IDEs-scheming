export { gitSubmodulesPaths as gitSubmodulesPaths };
declare function gitSubmodulesPaths(content: string): string[];
/** //TODO with git-cli
 * git submodule status --recursive
 * Other ways are not working
 * git submodule foreach --recursive --quiet 'echo $sm_path'
 * git submodule--helper list
 */ 
