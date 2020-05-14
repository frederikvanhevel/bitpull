"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfFormat = exports.NodeMap = exports.Status = exports.StorageProvider = exports.IntegrationType = exports.StorageService = exports.LogType = exports.NodeType = void 0;
const node_1 = require("./typedefs/node");
Object.defineProperty(exports, "NodeType", { enumerable: true, get: function () { return node_1.NodeType; } });
const common_1 = require("./typedefs/common");
Object.defineProperty(exports, "LogType", { enumerable: true, get: function () { return common_1.LogType; } });
Object.defineProperty(exports, "StorageService", { enumerable: true, get: function () { return common_1.StorageService; } });
Object.defineProperty(exports, "IntegrationType", { enumerable: true, get: function () { return common_1.IntegrationType; } });
Object.defineProperty(exports, "StorageProvider", { enumerable: true, get: function () { return common_1.StorageProvider; } });
Object.defineProperty(exports, "Status", { enumerable: true, get: function () { return common_1.Status; } });
const typedefs_1 = require("./nodes/processing/pdf/typedefs");
Object.defineProperty(exports, "PdfFormat", { enumerable: true, get: function () { return typedefs_1.PdfFormat; } });
const node_map_1 = __importDefault(require("./nodes/common/node-map"));
exports.NodeMap = node_map_1.default;
//# sourceMappingURL=typedefs.js.map