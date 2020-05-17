"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globby = void 0;
var globby_1 = __importDefault(require("globby"));
var path_1 = require("path");
var globbyOpts = {
    "gitignore": true,
    "ignore": [
        "tsconfig.json",
        "package.json",
        "package-lock.json"
    ],
    "dot": true,
    "suppressErrors": true,
    "absolute": true
};
function g(patterns, opts) {
    var _a;
    //Due to https://github.com/sindresorhus/globby/issues/133
    var _b = __assign(__assign({}, globbyOpts), opts), absolute = _b.absolute, o = __rest(_b, ["absolute"]), cwd = (_a = o.cwd) !== null && _a !== void 0 ? _a : process.cwd(), $return = globby_1.default(patterns, o);
    return (!absolute)
        ? $return
        : $return.then(function (filenames) {
            return filenames.map(function (filename) { return path_1.resolve(cwd, filename); });
        });
}
exports.globby = g;
