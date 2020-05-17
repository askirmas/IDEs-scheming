"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAsJson = void 0;
var fs_1 = require("fs");
var parse = JSON.parse;
function readAsJson(filename) {
    return new Promise(function (res, rej) {
        return fs_1.readFile(filename, function (err, content) {
            return err
                ? rej(err)
                : res(parse(content.toString()));
        });
    });
}
exports.readAsJson = readAsJson;
