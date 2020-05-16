import {readFile} from 'fs'
import {dirname, resolve} from 'path' 

const {parse} = JSON

export {
  readJson
}

//TODO async function
function readJson(
  calledBy: string,
  filename: string,
//  reviver?: Parameters<typeof JSON.parse>[1]
) {
  return new Promise((res, rej) => 
    //TODO Change with `require()`
    readFile(filename, (error, body) => {
      try {
        if (error)
          throw error
        res(
          //TODO jsonC?
          parse(
            body.toString()
            // like inline revi
            .replace(
              /"(\$ref|\$schema)"\s*:\s*"(\.[^"]+)"/gs,
              (substring, $k, path?: string) =>
              !path
              ? substring
              :`"${$k}":"${resolve(dirname(filename), path)}"`
            ),
            //TODO reviver
          )
        )
      }
      catch (error) {
        return rej({calledBy, filename, error})
      }
    })
  )
} 
