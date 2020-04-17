"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const errors_1 = require("../../common/errors");
const common_1 = require("../../../utils/common");
const file_1 = require("../../../utils/file");
const common_2 = require("../../../typedefs/common");
const errors_2 = require("../../../utils/errors");
const errors_3 = require("./errors");
const DROPBOX_UPLOAD_URL = 'https://content.dropboxapi.com/2/files/upload';
const DROPBOX_SHARED_LINK_URL = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';
const dropbox = async (input, options) => {
    const { integrations = [], onLog, onStorage } = options;
    const { node, passedData } = input;
    const dropboxIntegration = integrations.find(integration => integration.type === common_2.IntegrationType.DROPBOX);
    common_1.assert(passedData && passedData.path, errors_1.FileError.INVALID_FILE_PATH);
    common_1.assert(passedData && passedData.fileName, errors_1.FileError.INVALID_FILE_NAME);
    common_1.assert(dropboxIntegration, errors_1.IntegrationError.INTEGRATION_MISSING);
    common_1.assert(dropboxIntegration.active, errors_1.IntegrationError.INTEGRATION_INACTIVE);
    common_1.assert(dropboxIntegration.settings.access_token, errors_1.IntegrationError.ACCESS_TOKEN_MISSING);
    if (node.useDirectory) {
        common_1.assert(file_1.validateFilePath(node.directory), errors_1.FileError.INVALID_DIRECTORY);
    }
    const fileContents = fs_1.createReadStream(passedData.path);
    const directory = node.useDirectory ? node.directory : '/';
    const fileName = node.filename || passedData.fileName;
    const dropBoxPath = `${directory}${fileName}`;
    const dropboxArgs = {
        // TODO change file name
        path: dropBoxPath,
        mode: node.overwrite ? 'overwrite' : 'add',
        autorename: true,
        mute: false
    };
    // upload file
    try {
        await request_promise_native_1.default({
            uri: DROPBOX_UPLOAD_URL,
            method: 'POST',
            body: fileContents,
            encoding: passedData.encoding === 'binary' ? null : 'utf8',
            headers: {
                Authorization: `Bearer ${dropboxIntegration.settings.access_token}`,
                'Content-Type': 'application/octet-stream',
                'Dropbox-API-Arg': JSON.stringify(dropboxArgs)
            }
        });
    }
    catch (error) {
        throw new errors_2.FlowError(errors_3.DropboxError.UPLOAD_FAILED);
    }
    if (onLog)
        onLog(node, `File successfully uploaded to Dropbox: ${fileName}`);
    if ((node.children && node.children.length) || onStorage) {
        // get shared link
        const result = await request_promise_native_1.default({
            uri: DROPBOX_SHARED_LINK_URL,
            method: 'POST',
            body: {
                path: dropBoxPath,
                settings: { requested_visibility: 'public' }
            },
            json: true,
            headers: {
                Authorization: `Bearer ${dropboxIntegration.settings.access_token}`,
                'Content-Type': 'application/json'
            }
        });
        if (onStorage) {
            onStorage({
                service: common_2.StorageService.DROPBOX,
                fileName: result.name,
                url: result.url,
                contentType: passedData.contentType
            });
        }
        return Object.assign(Object.assign({}, input), { passedData: {
                name: result.name,
                url: result.url,
                previewType: result.preview_type
            } });
    }
    return input;
};
exports.default = dropbox;
//# sourceMappingURL=index.js.map