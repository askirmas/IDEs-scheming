import {linksReviver, dataKeys2resolve, schemaKeys2resolve} from "./linksReviver"

it("empty as data", () => expect(launcher(
  dataKeys2resolve,
  {}
)).toStrictEqual({
}))
it("empty as schema", () => expect(launcher(
  schemaKeys2resolve,
  {}
)).toStrictEqual({
}))

it("abs as data", () => expect(launcher(
  schemaKeys2resolve,
  {
    "$schema": "https://",
    "$ref": "//"
  }
)).toStrictEqual({
  "$schema": "https://",
  "$ref": "//"
}))

it("local as schema", () => expect(launcher(
  schemaKeys2resolve,
  {
    "$schema": "https://",
    "$ref": "//"
  }
)).toStrictEqual({
  "$schema": "https://",
  "$ref": "//"
}))

it("local as data", () => expect(launcher(
  dataKeys2resolve,
  {
    "$schema": "./$schema",
    "$ref": "../$ref#/definitions"
  }
)).toStrictEqual({
  "$schema": "/home/$schema",
  "$ref": "../$ref#/definitions"
}))

it("local as schema", () => expect(launcher(
  schemaKeys2resolve,
  {
    "$schema": "./$schema",
    "$ref": "../$ref#/definitions"
  }
)).toStrictEqual({
  "$schema": "/home/$schema",
  "$ref": "/$ref#/definitions"
}))

it("false positive", () => expect(launcher(
  schemaKeys2resolve,
  {
    "const": {"$ref": "../$ref#/definitions"}
  }
)).toStrictEqual({
  "const": {"$ref": "/$ref#/definitions"}
}))


function launcher(keys: Parameters<typeof linksReviver>[1], obj: any) {
  return JSON.parse(JSON.stringify(obj), linksReviver("/home", keys))
}