"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const errors_1 = require("../../common/errors");
const common_1 = require("../../../utils/common");
const helper_1 = require("../../../utils/helper");
const common_2 = require("../../../typedefs/common");
const file_1 = require("../../../utils/file");
const errors_2 = require("./errors");
const usesStorage = (settings) => {
    return (settings &&
        settings.storage &&
        settings.storage.provider !== common_2.StorageProvider.NONE);
};
const storage = async (input, options) => {
    const { settings, onLog, onStorage } = options;
    const { node, parent, passedData } = input;
    // if onStorage is undefined, don't actually store anything
    if (!usesStorage(settings)) {
        return Object.assign(Object.assign({}, input), { passedData: {
                name: '<<Storage not available>>',
                url: 'https://bitpull.io'
            } });
    }
    const storage = settings.storage;
    common_1.assert(storage && storage.credentials, errors_2.StorageError.STORAGE_OPTIONS_MISSING);
    common_1.assert(storage.credentials.bucket, errors_2.StorageError.AWS_BUCKET_MISSING);
    common_1.assert(storage.credentials.accessKeyId, errors_2.StorageError.AWS_ACCESS_KEY_ID_MISSING);
    common_1.assert(storage.credentials.secretAccessKey, errors_2.StorageError.AWS_SECRET_ACCESS_KEY_MISSING);
    common_1.assert(parent, errors_1.NodeError.NEEDS_PARENT);
    common_1.assert(helper_1.isFileNode(parent.type), errors_2.StorageError.INVALID_PARENT_TYPE);
    common_1.assert(passedData && passedData.path, errors_1.FileError.INVALID_FILE_PATH);
    common_1.assert(passedData && passedData.fileName, errors_1.FileError.INVALID_FILE_NAME);
    const params = {
        Bucket: storage.credentials.bucket,
        Key: passedData.fileName,
        Body: fs_1.createReadStream(passedData.path, {
            encoding: passedData.encoding === file_1.FileEncoding.BINARY
                ? undefined // null?
                : passedData.encoding
        })
    };
    const s3 = new aws_sdk_1.default.S3({
        accessKeyId: storage.credentials.accessKeyId,
        secretAccessKey: storage.credentials.secretAccessKey
    });
    const result = await s3.upload(params).promise();
    if (onLog)
        onLog(node, `File successfully stored: ${passedData.fileName}`);
    if (onStorage) {
        onStorage({
            service: common_2.StorageService.NATIVE,
            fileName: passedData.fileName,
            url: result.Location,
            contentType: passedData.contentType
        });
    }
    return Object.assign(Object.assign({}, input), { passedData: {
            name: passedData.fileName,
            url: result.Location
        } });
};
exports.default = storage;
//# sourceMappingURL=index.js.map