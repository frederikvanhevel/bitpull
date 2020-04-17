"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("../../../utils/file");
const common_1 = require("../../../utils/common");
const helper_1 = require("../../../utils/helper");
const errors_1 = require("../../../nodes/common/errors");
const json = async (input, options) => {
    const { onLog } = options;
    const { node, passedData } = input;
    common_1.assert(helper_1.hasChildExportNodes(node), errors_1.NodeError.EXPORT_NODE_MISSING);
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
//# sourceMappingURL=index.js.map