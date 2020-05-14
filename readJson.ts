import {readFile} from 'fs'
import {dirname, resolve} from 'path' 

export {
  readJson
}

function readJson(calledBy: string, filename: string) {
  //TODO async function
  return new Promise((res, rej) => 
    //TODO Change with `require()`
    readFile(filename, (error, body) => {
      try {
        if (error)
          throw error
        res(
          //TODO jsonC?
          JSON.parse(
            body.toString()
            .replace(
              /"(\$ref|\$schema)"\s*:\s*"(\.[^"]+)"/gs,
              (substring, $k, path?: string) =>
              !path
              ? substring
              :`"${$k}":"${resolve(dirname(filename), path)}"`
            )             
          )
        )
      }
      catch (error) {
        return rej({calledBy, filename, error})
      }
    })
  )
} 
