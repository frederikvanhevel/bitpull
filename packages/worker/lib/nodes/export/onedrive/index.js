"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const errors_1 = require("../../../utils/errors");
const common_1 = require("../../../utils/common");
const common_2 = require("../../../typedefs/common");
const errors_2 = require("../../common/errors");
const errors_3 = require("./errors");
const onedrive = async (input, options) => {
    const { integrations = [], onStorage, onLog } = options;
    const { node, passedData } = input;
    const oneDriveIntegration = integrations.find(integration => integration.type === common_2.IntegrationType.ONEDRIVE);
    common_1.assert(passedData && passedData.path, errors_2.FileError.INVALID_FILE_PATH);
    common_1.assert(passedData && passedData.fileName, errors_2.FileError.INVALID_FILE_NAME);
    common_1.assert(oneDriveIntegration, errors_2.IntegrationError.INTEGRATION_MISSING);
    common_1.assert(oneDriveIntegration.active, errors_2.IntegrationError.INTEGRATION_INACTIVE);
    common_1.assert(oneDriveIntegration.settings.access_token, errors_2.IntegrationError.ACCESS_TOKEN_MISSING);
    const fileContents = fs_1.createReadStream(passedData.path);
    const fileName = node.filename || passedData.fileName;
    // upload file
    let result;
    try {
        result = await request_promise_native_1.default({
            uri: `https://graph.microsoft.com/v1.0/drive/root:/${fileName}:/content`,
            method: 'PUT',
            body: fileContents,
            encoding: passedData.encoding === 'binary' ? null : 'utf8',
            headers: {
                Authorization: `Bearer ${oneDriveIntegration.settings.access_token}`,
                'Content-Type': passedData.contentType
            }
        });
    }
    catch (error) {
        throw new errors_1.FlowError(errors_3.OneDriveError.UPLOAD_FAILED);
    }
    const response = JSON.parse(result);
    if (onLog) {
        onLog(node, `File successfully uploaded to OneDrive: ${fileName}`);
    }
    if (onStorage) {
        onStorage({
            service: common_2.StorageService.ONEDRIVE,
            fileName: response.name,
            url: response.webUrl,
            contentType: passedData.contentType
        });
    }
    return Object.assign(Object.assign({}, input), { passedData: {
            name: response.name,
            url: response.webUrl
        } });
};
exports.default = onedrive;
