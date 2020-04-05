"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const common_1 = require("../../../utils/common");
const common_2 = require("../../../typedefs/common");
const errors_1 = require("../../common/errors");
const GOOGLE_DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
const googleDrive = async (input, options) => {
    const { integrations = [], onStorage, onLog } = options;
    const { node, passedData } = input;
    const googleDriveIntegration = integrations.find(integration => integration.type === common_2.IntegrationType.GOOGLE_DRIVE);
    common_1.assert(passedData && passedData.path, errors_1.FileError.INVALID_FILE_PATH);
    common_1.assert(passedData && passedData.fileName, errors_1.FileError.INVALID_FILE_NAME);
    common_1.assert(googleDriveIntegration, errors_1.IntegrationError.INTEGRATION_MISSING);
    common_1.assert(googleDriveIntegration.active, errors_1.IntegrationError.INTEGRATION_INACTIVE);
    common_1.assert(googleDriveIntegration.settings.access_token, errors_1.IntegrationError.ACCESS_TOKEN_MISSING);
    const fileContents = fs_1.createReadStream(passedData.path);
    const fileName = node.filename || passedData.fileName;
    // @ts-ignore
    const result = await request_promise_native_1.default({
        uri: GOOGLE_DRIVE_UPLOAD_URL,
        method: 'POST',
        preambleCRLF: true,
        postambleCRLF: true,
        multipart: [
            {
                'content-type': 'application/json',
                body: JSON.stringify({
                    name: fileName,
                    _attachments: {
                        [fileName]: {
                            follows: true,
                            content_type: passedData.contentType
                        }
                    }
                })
            },
            { body: fileContents }
        ],
        json: true,
        headers: {
            Authorization: `Bearer ${googleDriveIntegration.settings.access_token}`
        }
    });
    if (onLog)
        onLog(node, `File successfully uploaded to Google Drive: ${fileName}`);
    if ((node.children && node.children.length) || onStorage) {
        // get shared link
        const link = await request_promise_native_1.default({
            uri: `https://www.googleapis.com/drive/v3/files/${result.id}?fields=webViewLink`,
            method: 'GET',
            json: true,
            headers: {
                Authorization: `Bearer ${googleDriveIntegration.settings.access_token}`
            }
        });
        if (onStorage) {
            onStorage({
                service: common_2.StorageService.GOOGLE_DRIVE,
                fileName: result.name,
                url: link.webViewLink,
                contentType: passedData.contentType
            });
        }
        return Object.assign(Object.assign({}, input), { passedData: {
                name: result.name,
                url: link.webViewLink
            } });
    }
    return input;
};
exports.default = googleDrive;
