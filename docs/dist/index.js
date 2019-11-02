#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var glob_1 = __importDefault(require("glob"));
var wsPattern = '*.code-workspace', settingsPath = '.vscode/settings.json';
if (typeof require !== 'undefined' && require.main === module) {
    var result = true;
    try {
        result = main();
    }
    catch (e) {
        result = e;
    }
    finally {
        if (result === true)
            process.exit(0);
        console.error("\u001B[31m" + result + "\u001B[m");
        process.exit(1);
    }
}
// Check all json's
/**
* @param {string}path
*/
function main(ajv /* // Not required if this one first use as data and as schema only afterwards
.addMetaSchema(
  require('./schemas/draft04-strict.json')
)*/, 
//TODO: read .gitignore and etc stuff
ignore) {
    if (ajv === void 0) { ajv = (new (require('ajv'))({ schemaId: 'auto' })); }
    if (ignore === void 0) { ignore = "node_modules/**"; }
    var validateEntriesPacks = glob_1.default.sync(wsPattern)
        .map(function (wsPath) { return fs_1.default.existsSync(wsPath) && readJson(wsPath).settings; });
    validateEntriesPacks.push(fs_1.default.existsSync(settingsPath) && readJson(settingsPath));
    validateEntriesPacks = validateEntriesPacks
        .filter(function (x) { return x && typeof x === 'object' && x['json.schemas']; });
    return validateEntriesPacks.length === 0
        ? 'No IDE settings was found'
        : validateEntriesPacks
            .filter(function (x) { return x && typeof x === 'object' && x['json.schemas']; })
            .every(function (_a) {
            var validateEntries = _a["json.schemas"];
            return validateEntries.length === 0
                ? "Nothing to validate"
                : validateEntries
                    //@ts-ignore
                    .every(function (_a) {
                    var fileMatch = _a.fileMatch, url = _a.url;
                    if (url.startsWith('http')) {
                        console.warn('Schemas by URL is not supported yet');
                        return true;
                    }
                    return validateBySchema(fileMatch, url, ignore, ajv.compile(readJson(url)), function (e) { return ajv.errorsText(e); });
                });
        });
}
exports.default = main;
function validateBySchema(patterns, $schema, ignore, validate, errorsText) {
    return patterns.every(function (pattern) {
        var paths = glob_1.default.sync(vs2globpattern(pattern), { ignore: ignore });
        if (paths.length === 0)
            throw "No files under " + pattern;
        return paths.every(function (path) { return validateObject(readJson(path), validate, { $schema: $schema, pattern: pattern, path: path }, errorsText); });
    });
}
function validateObject(content, validate, scope, errorsText) {
    if (!validate(content))
        throw [
            "#Schema.Error: " + errorsText(validate.errors),
            JSON.stringify(scope)
        ].join("\n");
    return true;
}
function readJson(path) {
    try {
        return JSON.parse(
        //@ts-ignore Argument of type 'Buffer' is not assignable to parameter of type 'string'.ts(2345)
        fs_1.default.readFileSync(path));
    }
    catch (e) {
        throw path + ":\n" + e;
    }
}
function vs2globpattern(pattern) {
    return pattern.includes('/')
        ? pattern
        : "**/" + pattern;
}
