#/bin/bash
jq --version || apt install jq || sudo apt install jq

#jq not works '..|."json.schemas"? 

#find -regextype egrep -regex "(.*\.code-workspace|\./\.vscode/settings\.json)" -exec \
#jq '(.settings + .) | ."json.schemas" [] | {f: .fileMatch[], s: .url} | (.f | sub("^\\./"; "")), .s' {} \; | \
#xargs -n2 sh -c 'echo "$1 $2"; find -type f -wholename "*/$1" -exec echo $2 {} + ' sh

find -regextype egrep -regex "(.*\.code-workspace|\./\.vscode/settings\.json)" -exec \
jq '(.settings + .) | ."json.schemas" [] | {f: .fileMatch[], s: .url} | (.f | sub("^\\./"; "")), .s' {} \; | \
xargs -n 2 sh -c './validateMask.sh "*/$1" "$2"' sh
