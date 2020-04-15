"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../typedefs/node");
const errors_1 = require("./errors");
const FILE_NODES = [
    node_1.NodeType.PDF,
    node_1.NodeType.EXCEL,
    node_1.NodeType.CSV,
    node_1.NodeType.JSON,
    node_1.NodeType.SCREENSHOT
];
exports.IMPORT_PATHS = {
    [node_1.NodeType.COLLECT]: '../nodes/processing/collect',
    [node_1.NodeType.HTML]: '../nodes/processing/html',
    [node_1.NodeType.XML]: '../nodes/processing/xml',
    [node_1.NodeType.PAGINATION]: '../nodes/processing/pagination',
    [node_1.NodeType.CLICK]: '../nodes/processing/click',
    [node_1.NodeType.LOGIN]: '../nodes/processing/login',
    [node_1.NodeType.EXCEL]: '../nodes/processing/excel',
    [node_1.NodeType.CSV]: '../nodes/processing/csv',
    [node_1.NodeType.JSON]: '../nodes/processing/json',
    [node_1.NodeType.SCREENSHOT]: '../nodes/processing/screenshot',
    [node_1.NodeType.PDF]: '../nodes/processing/pdf',
    [node_1.NodeType.WAIT]: '../nodes/processing/wait',
    [node_1.NodeType.FUNCTION]: '../nodes/export/function',
    [node_1.NodeType.DROPBOX]: '../nodes/export/dropbox',
    [node_1.NodeType.GOOGLE_DRIVE]: '../nodes/export/google-drive',
    [node_1.NodeType.ONEDRIVE]: '../nodes/export/onedrive',
    [node_1.NodeType.GITHUB]: '../nodes/export/github',
    [node_1.NodeType.STORAGE]: '../nodes/export/storage',
    [node_1.NodeType.WEBHOOK]: '../nodes/export/webhook',
    [node_1.NodeType.SLACK]: '../nodes/notification/slack',
    [node_1.NodeType.EMAIL]: '../nodes/notification/email'
};
exports.isRootNode = (node) => {
    const linkNode = node;
    return ((linkNode.type === node_1.NodeType.HTML || linkNode.type === node_1.NodeType.XML) &&
        !!linkNode.link);
};
exports.getModule = async (type) => {
    if (!exports.IMPORT_PATHS[type]) {
        throw new errors_1.FlowError(`Node parser missing for type ${type}`);
    }
    const importedModule = await Promise.resolve().then(() => __importStar(require(exports.IMPORT_PATHS[type])));
    return importedModule.default;
};
exports.isFileNode = (type) => {
    return FILE_NODES.includes(type);
};
