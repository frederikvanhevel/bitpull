"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_1 = require("../../../utils/text");
const node_1 = require("../../../typedefs/node");
const errors_1 = require("../../../nodes/common/errors");
const common_1 = require("../../../utils/common");
exports.getMessage = (input) => {
    const { parent, passedData } = input;
    common_1.assert(parent, errors_1.NodeError.NEEDS_PARENT);
    common_1.assert(passedData, errors_1.FileError.FILE_MISSING);
    let message;
    if (parent.type === node_1.NodeType.DROPBOX ||
        parent.type === node_1.NodeType.GOOGLE_DRIVE ||
        parent.type === node_1.NodeType.ONEDRIVE ||
        parent.type === node_1.NodeType.GITHUB) {
        message = `File was successfully uploaded to ${text_1.capitalize(parent.type)}: <a href="${passedData.url}">${passedData.name}</a>`;
    }
    else if (parent.type === node_1.NodeType.STORAGE) {
        message = `File was successfully stored: <a href="${passedData.url}">${passedData.name}</a>`;
    }
    else if (parent.type === node_1.NodeType.WEBHOOK) {
        message = 'Request was sent to webhook';
    }
    else {
        message = 'Workflow notification';
    }
    return message;
};
