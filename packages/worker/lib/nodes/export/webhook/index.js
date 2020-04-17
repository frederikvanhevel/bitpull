"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const errors_1 = require("../../common/errors");
const common_1 = require("../../../utils/common");
const helper_1 = require("../../../utils/helper");
const errors_2 = require("./errors");
const webhook = async (input, options) => {
    const { onLog } = options;
    const { node, parent, passedData } = input;
    common_1.assert(node.path, errors_2.WebhookError.REQUEST_PATH_MISSING);
    common_1.assert(passedData, errors_1.FileError.FILE_MISSING);
    // TODO might want to send extra meta data here
    let requestOptions = {};
    if (parent && helper_1.isFileNode(parent.type)) {
        requestOptions = {
            // headers: {
            //     'Content-Transfer-Encoding': passedData.encoding
            // },
            formData: {
                file: {
                    value: fs_1.createReadStream(passedData.path, {
                        encoding: passedData.encoding
                    }),
                    options: {
                        filename: passedData.fileName,
                        contentType: passedData.contentType
                    }
                },
                filename: passedData.fileName
            }
        };
    }
    else {
        requestOptions = {
            body: {
                data: passedData
            },
            json: true
        };
    }
    await request_promise_native_1.default(Object.assign(Object.assign({ uri: node.path, method: node.method || 'POST' }, requestOptions), { headers: {
            userAgent: 'Bitpull/1.0'
        } }));
    if (onLog)
        onLog(node, `Successfully sent data to ${node.path}`);
    return Promise.resolve(input);
};
exports.default = webhook;
//# sourceMappingURL=index.js.map