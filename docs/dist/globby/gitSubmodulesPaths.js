"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitSubmodulesPaths = void 0;
function gitSubmodulesPaths(content) {
    //TODO check path with spaces
    var parser = /^\s*path\s*=\s*(.+)$/gm, $return = [];
    var result;
    while (result = parser.exec(content), result)
        $return.push(result[1].trim());
    return $return;
}
exports.gitSubmodulesPaths = gitSubmodulesPaths;
/** //TODO with git-cli
 * git submodule status --recursive
 * Other ways are not working
 * git submodule foreach --recursive --quiet 'echo $sm_path'
 * git submodule--helper list
 */ 
