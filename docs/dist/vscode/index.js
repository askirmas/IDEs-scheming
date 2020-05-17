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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.vscodeTasks = void 0;
var globby_1 = require("../globby");
var parameters_json_1 = require("./parameters.json");
var path_1 = require("path");
var readAsJson_1 = require("../readAsJson");
var workspace = parameters_json_1.patterns.workspace, settings = parameters_json_1.patterns.settings, key = 'json.schemas', vsEntries = [workspace, settings];
function vscodeTasks(cwd) {
    return __awaiter(this, void 0, void 0, function () {
        var cwds, wsFiles, setFiles, vsFiles, _a, wsFilesSet, setFilesSet, cwdsSet, vsSets, tasks, _loop_1, i;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cwds = [cwd !== null && cwd !== void 0 ? cwd : process.cwd()], wsFiles = [], setFiles = [], vsFiles = [wsFiles, setFiles], _a = __read(vsFiles.concat(cwds).map(function (f) { return new Set(f); }), 3), wsFilesSet = _a[0], setFilesSet = _a[1], cwdsSet = _a[2], vsSets = [wsFilesSet, setFilesSet], tasks = [];
                    _loop_1 = function (i) {
                        var cwd_1, entries, e, files, f, file, arr, set, data, settings_1, _a, folders, s, i_1, folder, records, index, meta, record, fileMatch, length, files_1, i_2, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    cwd_1 = cwds[i];
                                    return [4 /*yield*/, Promise.all(vsEntries
                                            .map(function (p) { return globby_1.globby(p, { cwd: cwd_1 }); }))];
                                case 1:
                                    entries = _d.sent();
                                    e = entries.length;
                                    _d.label = 2;
                                case 2:
                                    if (!e--) return [3 /*break*/, 13];
                                    files = entries[e];
                                    f = files.length;
                                    _d.label = 3;
                                case 3:
                                    if (!f--) return [3 /*break*/, 12];
                                    file = path_1.resolve(cwd_1, files[f]), arr = vsFiles[e], set = vsSets[e];
                                    if (set.has(file))
                                        return [3 /*break*/, 11];
                                    set.add(file);
                                    arr.push(file);
                                    return [4 /*yield*/, readAsJson_1.readAsJson(file)];
                                case 4:
                                    data = _d.sent();
                                    settings_1 = undefined;
                                    switch (e) {
                                        case 0:
                                            _a = data, folders = _a.folders, s = _a.settings;
                                            settings_1 = s;
                                            if (!folders)
                                                break;
                                            for (i_1 = folders.length; i_1--;) {
                                                folder = path_1.resolve(cwd_1, folders[i_1].path);
                                                if (cwdsSet.has(folder))
                                                    continue;
                                                cwdsSet.add(folder);
                                                cwds.push(folder);
                                            }
                                            break;
                                        case 1:
                                            settings_1 = data;
                                            break;
                                    }
                                    if (!settings_1)
                                        return [3 /*break*/, 11];
                                    records = settings_1[key];
                                    if (!records)
                                        return [3 /*break*/, 11];
                                    index = records.length;
                                    _d.label = 5;
                                case 5:
                                    if (!index--) return [3 /*break*/, 11];
                                    meta = { source: file, cwd: cwd_1, index: index }, record = records[index], fileMatch = record.fileMatch, length = fileMatch.length, files_1 = new Array(length);
                                    i_2 = length;
                                    _d.label = 6;
                                case 6:
                                    if (!i_2--) return [3 /*break*/, 9];
                                    _b = files_1;
                                    _c = i_2;
                                    return [4 /*yield*/, globby_1.globby(fileMatch[i_2], { cwd: cwd_1, absolute: false })];
                                case 7:
                                    _b[_c] = (_d.sent())
                                        .map(function (f) { return path_1.resolve(cwd_1, f); });
                                    _d.label = 8;
                                case 8: return [3 /*break*/, 6];
                                case 9:
                                    tasks.push(__assign(__assign(__assign({}, record), meta), { files: files_1 }));
                                    _d.label = 10;
                                case 10: return [3 /*break*/, 5];
                                case 11: return [3 /*break*/, 3];
                                case 12: return [3 /*break*/, 2];
                                case 13: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < cwds.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, tasks];
            }
        });
    });
}
exports.vscodeTasks = vscodeTasks;
