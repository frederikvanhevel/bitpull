"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const errors_1 = require("../../common/errors");
const common_1 = require("../../../utils/common");
const file_1 = require("../../../utils/file");
const common_2 = require("../../../typedefs/common");
const errors_2 = require("../../../utils/errors");
const errors_3 = require("./errors");
const GITHUB_API_URL = 'https://api.github.com';
const github = async (input, options) => {
    const { integrations = [], onLog, onStorage } = options;
    const { node, passedData } = input;
    const githubIntegration = integrations.find(integration => integration.type === common_2.IntegrationType.GITHUB);
    common_1.assert(passedData && passedData.path, errors_1.FileError.INVALID_FILE_PATH);
    common_1.assert(passedData && passedData.fileName, errors_1.FileError.INVALID_FILE_NAME);
    common_1.assert(node.repo, errors_3.GithubError.REPOSITORY_MISSING);
    common_1.assert(/.*\/.*/.test(node.repo), errors_3.GithubError.WRONG_REPOSITORY_FORMAT);
    common_1.assert(githubIntegration, errors_1.IntegrationError.INTEGRATION_MISSING);
    common_1.assert(githubIntegration.active, errors_1.IntegrationError.INTEGRATION_INACTIVE);
    common_1.assert(githubIntegration.settings.access_token, errors_1.IntegrationError.ACCESS_TOKEN_MISSING);
    // // upload file
    let result;
    try {
        result = await request_promise_native_1.default({
            uri: GITHUB_API_URL +
                `/repos/${node.repo}/contents/${passedData.fileName}`,
            method: 'PUT',
            body: {
                message: 'Uploaded file via BitPull.io',
                committer: {
                    name: 'BitPull.io',
                    email: 'bot@bitpull.io'
                },
                content: await file_1.readFile(passedData.path, file_1.FileEncoding.BASE64)
            },
            json: true,
            headers: {
                Authorization: `Bearer ${githubIntegration.settings.access_token}`,
                'User-Agent': 'BitPull.io'
            }
        });
    }
    catch (error) {
        throw new errors_2.FlowError(errors_3.GithubError.UPLOAD_FAILED);
    }
    if (onLog) {
        onLog(node, `File successfully uploaded to Github: ${passedData.fileName}`);
    }
    if (onStorage) {
        onStorage({
            service: common_2.StorageService.GITHUB,
            fileName: result.content.name,
            url: result.content.html_url,
            contentType: passedData.contentType
        });
    }
    return Object.assign(Object.assign({}, input), { passedData: {
            name: result.content.name,
            url: result.content.html_url
        } });
};
exports.default = github;
