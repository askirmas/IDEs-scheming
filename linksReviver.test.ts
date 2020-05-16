import {linksReviver, dataKeys2resolve, schemaKeys2resolve} from "./linksReviver"

it("empty as data", () => expect(launcher(
  dataKeys2resolve,
  {}
)).toStrictEqual({
  resolved: new Set([]),
  $return: {}
}))
it("empty as schema", () => expect(launcher(
  schemaKeys2resolve,
  {}
)).toStrictEqual({
  resolved: new Set([]),
  $return: {}
}))

it("abs as data", () => expect(launcher(
  schemaKeys2resolve,
  {
    "$schema": "https://",
    "$ref": "//"
  }
)).toStrictEqual({
  resolved: new Set([]),
  $return: {
    "$schema": "https://",
    "$ref": "//"
  }
}))

it("abs as schema", () => expect(launcher(
  schemaKeys2resolve,
  {
    "$schema": "https://",
    "$ref": "//"
  }
)).toStrictEqual({
  resolved: new Set([]),
  $return: {
  "$schema": "https://",
  "$ref": "//"
  }
}))

it("local as data", () => expect(launcher(
  dataKeys2resolve,
  {
    "$schema": "./$schema",
    "$ref": "../$ref#/definitions"
  }
)).toStrictEqual({
  resolved: new Set(["/home/$schema"]),
  $return: {
  "$schema": "/home/$schema",
  "$ref": "../$ref#/definitions"
  }
}))

it("local as schema", () => expect(launcher(
  schemaKeys2resolve,
  {
    "$schema": "./$schema",
    "$ref": "../$ref#/definitions"
  }
)).toStrictEqual({
  resolved: new Set(["/home/$schema", "/$ref#/definitions"]),
  $return: {
  "$schema": "/home/$schema",
  "$ref": "/$ref#/definitions"
  }
}))

it("false positive", () => expect(launcher(
  schemaKeys2resolve,
  {
    "const": {"$ref": "../$ref#/definitions"}
  }
)).toStrictEqual({
  resolved: new Set(["/$ref#/definitions"]),
  $return: {
  "const": {"$ref": "/$ref#/definitions"}
  }
}))


function launcher(keys: Parameters<typeof linksReviver>[1], obj: any) {
  const resolved: Set<string> = new Set()
  , $return = JSON.parse(JSON.stringify(obj), linksReviver("/home", keys, resolved))
  return {
    $return,
    resolved
  }
}