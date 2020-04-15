"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const tmp_1 = __importDefault(require("tmp"));
const xml2js_1 = require("xml2js");
const errors_1 = require("../nodes/common/errors");
const errors_2 = require("./errors");
// cleanup files even on uncaught exceptions
tmp_1.default.setGracefulCleanup();
// TODO add to settings
const FILE_PREFIX = 'nf-';
var FileType;
(function (FileType) {
    FileType["JSON"] = "json";
    FileType["EXCEL"] = "xlsx";
    FileType["PDF"] = "pdf";
    FileType["CSV"] = "csv";
    FileType["PNG"] = "png";
})(FileType = exports.FileType || (exports.FileType = {}));
var FileEncoding;
(function (FileEncoding) {
    FileEncoding["UTF8"] = "utf8";
    FileEncoding["BINARY"] = "binary";
    FileEncoding["BASE64"] = "base64";
})(FileEncoding = exports.FileEncoding || (exports.FileEncoding = {}));
exports.writeFile = (content, type, encoding = FileEncoding.UTF8) => {
    return new Promise((resolve, reject) => {
        tmp_1.default.file({ prefix: FILE_PREFIX, postfix: `.${type}` }, (err, path) => {
            if (err)
                reject(err);
            fs_1.default.writeFile(path, content, encoding, error => {
                if (error)
                    reject(error);
                else
                    resolve(path);
            });
        });
    });
};
exports.readFile = async (path, encoding) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(path, { encoding }, (err, data) => {
            if (err)
                reject(err);
            resolve(data);
        });
    });
};
exports.validateFilePath = (path) => {
    return /^(\/[\w^ ]+)+\/$/.test(path);
};
exports.getFileNameFromPath = (path) => {
    const match = path.match(/[^/]+$/);
    if (!match || !match.length) {
        throw new Error("Can't find filename from path");
    }
    return match[0];
};
exports.parseXml = async (body) => {
    const { parseStringPromise } = new xml2js_1.Parser({ explicitArray: false });
    try {
        return await parseStringPromise(body);
    }
    catch (error) {
        throw new errors_2.FlowError(errors_1.ParseError.XML_PARSE_ERROR);
    }
};
