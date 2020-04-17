"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
var EncyptionAlgorithm;
(function (EncyptionAlgorithm) {
    EncyptionAlgorithm["v1"] = "aes-256-ctr";
})(EncyptionAlgorithm = exports.EncyptionAlgorithm || (exports.EncyptionAlgorithm = {}));
exports.isEncryptionVersionSupported = (version) => {
    return Object.keys(EncyptionAlgorithm).includes(version);
};
exports.decrypt = (key, text, algorithm = 'v1') => {
    const alg = EncyptionAlgorithm[algorithm];
    const decipher = crypto_1.default.createDecipher(alg, key);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
//# sourceMappingURL=encryption.js.map