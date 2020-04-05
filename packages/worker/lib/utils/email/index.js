"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
exports.SUPPORT_EMAIL_ADDRESS = 'help@bitpull.io';
exports.Senders = {
    Bitpull: { email: exports.SUPPORT_EMAIL_ADDRESS, name: 'Bitpull' }
};
exports.sendMail = (options, settings) => {
    var _a, _b, _c, _d;
    if (process.env.NODE_ENV === 'test') {
        return;
    }
    assert_1.default((_a = settings.email) === null || _a === void 0 ? void 0 : _a.apiKey, 'Email api not set up correctly');
    assert_1.default((_b = settings.email) === null || _b === void 0 ? void 0 : _b.template, 'Email template not set up correctly');
    mail_1.default.setApiKey((_c = settings.email) === null || _c === void 0 ? void 0 : _c.apiKey);
    const message = {
        to: options.to,
        from: options.from || exports.Senders.Bitpull,
        templateId: (_d = settings.email) === null || _d === void 0 ? void 0 : _d.template,
        dynamic_template_data: options.params
    };
    return mail_1.default.send(message).catch(() => {
        throw new Error('Error sending email');
    });
};
