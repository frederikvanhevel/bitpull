"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const errors_1 = require("../nodes/common/errors");
const errors_2 = require("./errors");
const REQUEST_MAX_RETRIES = 10;
const REQUEST_TIMEOUT = 120000;
exports.request = async (url, retries = 0) => {
    try {
        const response = await request_promise_native_1.default({
            uri: url,
            timeout: REQUEST_TIMEOUT,
            resolveWithFullResponse: true
        });
        return response.body;
    }
    catch (error) {
        if (error.statusCode === 404) {
            return null;
        }
        if (retries < REQUEST_MAX_RETRIES) {
            // console.error(`${url} - retrying ... (${retries + 1})`);
            return await exports.request(url, ++retries);
        }
        throw new Error(`${url} - failed after ${REQUEST_MAX_RETRIES} retries`);
    }
};
exports.getUriOrigin = (uri) => {
    const url = new URL(uri);
    return url.origin;
};
function assert(condition, errorCode = errors_1.NodeError.UNKNOWN_ERROR) {
    if (!condition)
        throw new errors_2.FlowError(errorCode);
}
exports.assert = assert;
exports.isTestEnv = () => process.env.NODE_ENV === 'test';
exports.clamp = (number, min, max) => {
    return Math.min(Math.max(number, min), max);
};
//# sourceMappingURL=common.js.map