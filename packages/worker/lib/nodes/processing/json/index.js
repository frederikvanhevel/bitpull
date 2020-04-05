"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("../../../utils/file");
const json = async (input, options) => {
    const { onLog } = options;
    const { node, passedData } = input;
    const path = await file_1.writeFile(JSON.stringify(passedData, null, 4), file_1.FileType.JSON);
    if (onLog)
        onLog(node, 'Succesfully converted to json file');
    return Promise.resolve(Object.assign(Object.assign({}, input), { passedData: {
            path,
            fileName: file_1.getFileNameFromPath(path),
            contentType: 'application/json'
        } }));
};
exports.default = json;
