import { readFile } from "fs"

const {parse} = JSON

export {
  readAsJson
}

function readAsJson(filename: string) {
  return new Promise((res, rej) =>
    readFile(filename, (err, content) =>
      err
      ? rej(err)
      : res(parse(content.toString()))
    )
  )
}
