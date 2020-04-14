"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p3x_json2xls_worker_thread_1 = __importDefault(require("p3x-json2xls-worker-thread"));
const file_1 = require("../../../utils/file");
const excel = async (input, options) => {
    const { onLog } = options;
    const { node, passedData } = input;
    const excelData = await p3x_json2xls_worker_thread_1.default(passedData);
    const path = await file_1.writeFile(excelData, file_1.FileType.EXCEL, file_1.FileEncoding.BINARY);
    if (onLog)
        onLog(node, 'Succesfully converted to excel file');
    return Promise.resolve(Object.assign(Object.assign({}, input), { passedData: {
            path,
            fileName: file_1.getFileNameFromPath(path),
            encoding: file_1.FileEncoding.BINARY,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        } }));
};
exports.default = excel;
