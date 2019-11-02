#/bin/bash
# xmllint --version || sudo apt  install libxml2-utils

# https://stackoverflow.com/a/44220069/9412937
xmllint ./.idea/jsonSchemas.xml --xpath "//SchemaInfo/option[@name='relativePathToSchema'] | //SchemaInfo/option[@name='patterns']/list//option[@name='path']/@value" 