"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_1 = require("../../../utils/text");
const node_1 = require("../../../typedefs/node");
const common_1 = require("../../../typedefs/common");
const common_2 = require("../../../utils/common");
const errors_1 = require("../../../nodes/common/errors");
exports.getMessage = (input, options) => {
    var _a;
    const { settings } = options;
    const { parent, passedData } = input;
    common_2.assert(parent, errors_1.NodeError.NEEDS_PARENT);
    common_2.assert(passedData, errors_1.FileError.FILE_MISSING);
    let message;
    if (parent.type === node_1.NodeType.DROPBOX ||
        parent.type === node_1.NodeType.GOOGLE_DRIVE ||
        parent.type === node_1.NodeType.ONEDRIVE ||
        parent.type === node_1.NodeType.GITHUB) {
        message = {
            attachments: [
                {
                    fallback: `File was successfully uploaded to ${text_1.capitalize(parent.type)}:`,
                    pretext: `File was successfully uploaded to ${text_1.capitalize(parent.type)}:`,
                    title: passedData.name,
                    title_link: passedData.url
                }
            ]
        };
    }
    else if (parent.type === node_1.NodeType.STORAGE) {
        message = {
            attachments: [
                {
                    fallback: 'File was successfully stored',
                    pretext: 'File was successfully stored:',
                    title: ((_a = settings === null || settings === void 0 ? void 0 : settings.storage) === null || _a === void 0 ? void 0 : _a.provider) === common_1.StorageProvider.AMAZON
                        ? passedData.url
                        : passedData.name,
                    title_link: passedData.url
                }
            ]
        };
    }
    else if (parent.type === node_1.NodeType.WEBHOOK) {
        message = {
            text: 'Request sent to webhook.'
        };
    }
    else {
        message = {
            text: 'Completed successfully.'
        };
    }
    return message;
};
