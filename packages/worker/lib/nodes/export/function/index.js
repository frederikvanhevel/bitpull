"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const errors_1 = require("./errors");
const functionNode = input => {
    const { node, passedData } = input;
    assert_1.default(node.function, errors_1.FunctionError.NO_FUNCTION_SPECIFIED);
    node.function(passedData);
    return Promise.resolve(input);
};
exports.default = functionNode;
//# sourceMappingURL=index.js.map