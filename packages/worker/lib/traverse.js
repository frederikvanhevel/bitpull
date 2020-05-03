"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const deepmerge_1 = __importDefault(require("deepmerge"));
const node_1 = require("./typedefs/node");
const helper_1 = require("./utils/helper");
const common_1 = require("./typedefs/common");
const browser_1 = __importDefault(require("./browser"));
const errors_1 = require("./nodes/common/errors");
const errors_2 = require("./utils/errors");
const logger_1 = __importDefault(require("./utils/logging/logger"));
const DEFAULT_OPTIONS = {
    integrations: [],
    settings: {
        storage: {
            provider: common_1.StorageProvider.NONE
        },
        exitOnError: false,
        maxErrorsBeforeExit: 10
    }
};
class Traverser {
    constructor(options = DEFAULT_OPTIONS, browser) {
        var _a;
        this.canceled = false;
        this.errorCount = 0;
        this.options = deepmerge_1.default(DEFAULT_OPTIONS, options);
        this.context = {
            traverser: this,
            browser: browser || new browser_1.default()
        };
        if ((_a = options.settings) === null || _a === void 0 ? void 0 : _a.traceId) {
            logger_1.default.setTraceId(options.settings.traceId);
        }
    }
    async getNodeResult(input) {
        var _a;
        const { node, branchCallback } = input;
        const { onStart, onComplete, onLog } = this.options;
        onStart && onStart(node);
        let nodeResult;
        const module = await helper_1.getModule(node.type);
        if (((_a = node.children) === null || _a === void 0 ? void 0 : _a.length) &&
            (node.type === node_1.NodeType.PAGINATION ||
                node.type === node_1.NodeType.HTML_MULTIPLE ||
                node.type === node_1.NodeType.CLICK_MULTIPLE)) {
            const branchNode = node;
            const branchResult = await module(input, this.options, this.context);
            const endNode = branchNode.goToOnEnd
                ? node.children.find(childNode => childNode.id === branchNode.goToOnEnd)
                : undefined;
            if (endNode) {
                onLog && onLog(node, 'Pagination finished');
                nodeResult = await this.getNodeResult(Object.assign(Object.assign({}, input), { node: endNode, passedData: [].concat(...branchResult.passedData) }));
            }
            else {
                nodeResult = branchResult;
            }
        }
        else {
            nodeResult = await module(input, this.options, this.context);
        }
        if (!node.children || !node.children.length) {
            // if we are at the end of a pagination tree return the data to it
            if (branchCallback)
                branchCallback(nodeResult.passedData);
        }
        onComplete && onComplete(node);
        return nodeResult;
    }
    async parseNode(input) {
        var _a;
        const { node: currentNode, rootAncestor } = input;
        const { onError, onLog, settings } = this.options;
        if (this.canceled) {
            throw new Error('Operation was canceled');
        }
        if (currentNode.disabled)
            return input;
        try {
            const isPrimaryNode = helper_1.isRootNode(currentNode);
            const nodeResult = await this.getNodeResult(Object.assign({}, input));
            assert_1.default(nodeResult, errors_1.NodeError.NO_RESULT);
            const { node } = nodeResult;
            if (!helper_1.isBranchNode(node) && ((_a = node.children) === null || _a === void 0 ? void 0 : _a.length)) {
                await Promise.all(node.children.map(async (child) => this.parseNode(Object.assign(Object.assign(Object.assign({}, input), nodeResult), { node: child, parent: node, rootAncestor: isPrimaryNode
                        ? currentNode
                        : rootAncestor })).catch(error => {
                    if (settings.exitOnError) {
                        throw error;
                    }
                    else if (onError) {
                        onError(child, error);
                    }
                })));
            }
            return Object.assign(Object.assign({}, input), nodeResult);
        }
        catch (error) {
            if (onError)
                onError(currentNode, error);
            if (onLog)
                onLog(currentNode, error.message, common_1.LogType.ERROR);
            if (settings.exitOnError)
                throw error;
            return input;
        }
    }
    async run(node) {
        const originalErrorFn = this.options.onError;
        const originalLogFn = this.options.onLog;
        const originalStorageFn = this.options.onStorage;
        const { maxErrorsBeforeExit } = this.options.settings;
        const logs = [];
        const errors = [];
        const files = [];
        this.options.onError = (node, error) => {
            this.errorCount++;
            if (!!maxErrorsBeforeExit &&
                this.errorCount > maxErrorsBeforeExit) {
                throw new errors_2.FlowError(errors_1.NodeError.TOO_MANY_ERRORS);
            }
            errors.push({
                nodeId: node.id,
                nodeType: node.type,
                date: new Date(),
                message: error.message,
                code: error.code
            });
            originalErrorFn && originalErrorFn(node, error);
        };
        this.options.onLog = (node, message, type = common_1.LogType.INFO) => {
            logs.push({
                type,
                date: new Date(),
                nodeId: node.id,
                nodeType: node.type,
                message
            });
            originalLogFn && originalLogFn(node, message, type);
        };
        this.options.onStorage = (data) => {
            const file = Object.assign(Object.assign({}, data), { createdAt: new Date() });
            files.push(file);
            originalStorageFn && originalStorageFn(data);
        };
        let status = common_1.Status.UNDETERMINED;
        try {
            await this.parseNode({ node });
            if (errors.length === logs.length) {
                status = common_1.Status.ERROR;
            }
            else {
                status = errors.length ? common_1.Status.PARTIAL_SUCCESS : common_1.Status.SUCCESS;
            }
        }
        catch (error) {
            if (!this.canceled)
                logger_1.default.error(new Error('Fatal error during run'), error);
            status = common_1.Status.ERROR;
        }
        finally {
            this.options.onError = originalErrorFn;
            this.options.onLog = originalLogFn;
            this.options.onStorage = originalStorageFn;
            await this.cleanup();
        }
        return {
            status,
            errors,
            logs,
            files
        };
    }
    cancel() {
        this.canceled = true;
    }
    async forceCancel() {
        this.canceled = true;
        await this.cleanup();
        throw new Error('Operation was cancelled');
    }
    async cleanup() {
        this.canceled = true;
        const { browser } = this.context;
        if (!browser)
            return;
        await browser.cleanup();
        delete this.context.browser;
    }
    setOptions(options) {
        this.options = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
    }
}
exports.default = Traverser;
//# sourceMappingURL=traverse.js.map