"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var glob_1 = __importDefault(require("glob"));
if (typeof require !== 'undefined' && require.main === module) {
    try {
        main();
    }
    catch (e) {
        console.error("\u001B[31m" + e + "\u001B[m");
        process.exit(1);
    }
}
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
    var wsPattern = '*.code-workspace', wss = glob_1.default.sync(wsPattern);
    if (wss.length === 0)
        throw "No " + wsPattern + " found";
    return wss.every(function (wsPath) {
        var ws = readJson(wsPath);
        if (!('settings' in ws && 'json.schemas' in ws.settings))
            throw "Nothing to validate in " + wsPath;
        return ws.settings['json.schemas']
            .every(function (_a) {
            var fileMatch = _a.fileMatch, url = _a.url;
            if (url.startsWith('http')) {
                console.warn('Schemas by URL is not supported yet');
                return true;
            }
            var validate = ajv.compile(readJson(url));
            return fileMatch.every(function (pattern) {
                var paths = glob_1.default.sync(pattern.includes('/')
                    ? pattern
                    : "**/" + pattern, { ignore: ignore });
                if (paths.length === 0)
                    throw "No files under " + pattern;
                return paths.every(function (p) {
                    if (!validate(readJson(p)))
                        throw [
                            "#Schema.Error: " + ajv.errorsText(validate.errors),
                            "path: " + p,
                            "pattern: " + pattern,
                            "schema: " + url
                        ].join("\n");
                    return true;
                });
            });
        });
    });
}
exports.default = main;
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
