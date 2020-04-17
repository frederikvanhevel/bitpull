"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p3x_json2xls_worker_thread_1 = __importDefault(require("p3x-json2xls-worker-thread"));
const file_1 = require("../../../utils/file");
const errors_1 = require("../../../utils/errors");
const common_1 = require("../../../utils/common");
const helper_1 = require("../../../utils/helper");
const errors_2 = require("../../../nodes/common/errors");
const errors_3 = require("./errors");
const excel = async (input, options) => {
    const { onLog } = options;
    const { node, passedData } = input;
    common_1.assert(helper_1.hasChildExportNodes(node), errors_2.NodeError.EXPORT_NODE_MISSING);
    let path;
    try {
        const excelData = await p3x_json2xls_worker_thread_1.default(passedData);
        path = await file_1.writeFile(excelData, file_1.FileType.EXCEL, file_1.FileEncoding.BINARY);
    }
    catch (error) {
        throw new errors_1.FlowError(errors_3.ExeclError.COULD_NOT_CREATE);
    }
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
//# sourceMappingURL=index.js.map