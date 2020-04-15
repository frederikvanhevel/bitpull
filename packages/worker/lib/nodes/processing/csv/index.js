"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("../../../utils/file");
const errors_1 = require("../../../utils/errors");
const errors_2 = require("./errors");
const csv = async (input, options) => {
    const { onLog } = options;
    const { node, passedData } = input;
    let path;
    try {
        const csvData = await file_1.convertToCsv(passedData);
        path = await file_1.writeFile(csvData, file_1.FileType.CSV, file_1.FileEncoding.UTF8);
    }
    catch (error) {
        throw new errors_1.FlowError(errors_2.CsvError.COULD_NOT_CREATE);
    }
    if (onLog)
        onLog(node, 'Succesfully converted to csv file');
    return Promise.resolve(Object.assign(Object.assign({}, input), { passedData: {
            path,
            fileName: file_1.getFileNameFromPath(path),
            encoding: file_1.FileEncoding.UTF8,
            contentType: 'text/csv'
        } }));
};
exports.default = csv;
