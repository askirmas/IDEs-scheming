#!/usr/bin/env node
"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var glob_1 = __importDefault(require("glob"));
var config_json_1 = __importDefault(require("./config.json"));
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
function main(options, ajv) {
    if (options === void 0) { options = {}; }
    if (ajv === void 0) { ajv = (new (require(config_json_1.default.interpreter.ref))(config_json_1.default.interpreter.opts)); }
    var opts = Object.assign({}, config_json_1.default, options || {}), ignore = opts.ignore, wsPattern = opts.wsPattern, settingsPath = opts.settingsPath, listPattern = opts.listPattern, fileList = new Set(glob_1.default.sync(listPattern, { ignore: ignore }));
    var validateEntriesPacks = glob_1.default.sync(wsPattern)
        .map(function (wsPath) {
        return fs_1.default.existsSync(wsPath)
            && readJson(wsPath).settings;
    });
    validateEntriesPacks.push(fs_1.default.existsSync(settingsPath)
        && readJson(settingsPath));
    validateEntriesPacks = validateEntriesPacks
        .filter(function (x) { return x && typeof x === 'object' && x['json.schemas']; });
    var result = validateEntriesPacks.length === 0
        ? 'No IDE settings was found'
        : validateEntriesPacks
            .filter(function (x) { return x && typeof x === 'object' && x['json.schemas']; }).every(function (_a) {
            var validateEntries = _a["json.schemas"];
            return validateEntries.length === 0
                ? "Nothing to validate"
                : validateEntries
                    .every(function (_a) {
                    var fileMatch = _a.fileMatch, url = _a.url;
                    if (url.startsWith('http')) {
                        console.warn('Schemas by URL is not supported yet');
                        return true;
                    }
                    return validateBySchema(fileMatch, url, ignore, ajv.compile(readJson(url)), function (e) { return ajv.errorsText(e); }, fileList);
                });
        });
    return result && (fileList.size === 0
        || "These JSONs have no schema:\n" + __spread(fileList.values()).join("\n"));
}
exports.default = main;
function validateBySchema(patterns, $schema, ignore, validate, errorsText, fileList) {
    return patterns.every(function (pattern) {
        var paths = glob_1.default.sync(vs2globpattern(pattern), { ignore: ignore });
        if (paths.length === 0)
            throw "No files under " + pattern;
        return paths.every(function (path) { return validateObject(path, validate, { fileList: fileList, $schema: $schema, pattern: pattern, path: path }, errorsText); });
    });
}
function validateObject(path, validate, _a, errorsText) {
    if (_a === void 0) { _a = {}; }
    var fileList = _a.fileList, scope = __rest(_a, ["fileList"]);
    if (!validate(readJson(path)))
        throw __spread([
            "#Schema.Error: " + errorsText(validate.errors)
        ], Object.entries(scope)
            .map(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            return key + ": " + JSON.stringify(value);
        })).join("\n");
    fileList && fileList.delete(path.replace(/^\.\//, ''));
    return true;
}
function readJson(path) {
    try {
        return JSON.parse(fs_1.default.readFileSync(path));
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
