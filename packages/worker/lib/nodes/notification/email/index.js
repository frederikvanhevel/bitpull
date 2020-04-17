"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const email_1 = require("../../../utils/email");
const helper_1 = require("./helper");
const errors_1 = require("./errors");
const email = async (input, options) => {
    var _a, _b, _c;
    const { settings, onLog } = options;
    const { node } = input;
    assert_1.default((_a = settings.email) === null || _a === void 0 ? void 0 : _a.to, errors_1.EmailError.TO_ADDRESS_MISSING);
    const message = helper_1.getMessage(input);
    await email_1.sendMail({
        to: (_b = settings.email) === null || _b === void 0 ? void 0 : _b.to,
        params: {
            message,
            metaData: settings.metaData
        }
    }, settings);
    if (onLog)
        onLog(node, `Sent email to ${(_c = settings.email) === null || _c === void 0 ? void 0 : _c.to}`);
    return input;
};
exports.default = email;
//# sourceMappingURL=index.js.map