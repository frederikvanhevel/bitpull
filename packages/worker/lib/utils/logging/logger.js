"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const typedefs_1 = require("./typedefs");
const helper_1 = require("./helper");
class Logger {
    static setTraceId(traceId) {
        this.traceId = traceId;
    }
    static info(message) {
        const data = {
            type: typedefs_1.LogType.INFO,
            timestamp: new Date(),
            traceId: Logger.traceId,
            message
        };
        this.executeLog(data);
    }
    static warn(message) {
        const data = {
            type: typedefs_1.LogType.WARN,
            timestamp: new Date(),
            traceId: Logger.traceId,
            message
        };
        this.executeLog(data);
    }
    static error(error, relatedError) {
        const data = {
            type: typedefs_1.LogType.ERROR,
            timestamp: new Date(),
            traceId: Logger.traceId,
            error,
            message: error.stack,
            relatedError,
            stack: relatedError ? relatedError.stack : error.stack
        };
        this.executeLog(data);
    }
    static throw(error, relatedError) {
        this.error(error, relatedError);
        throw error;
    }
    static executeLog(log) {
        const logFunction = this.getLogFunction(log.type);
        if (!this.jsonOutput) {
            const formatted = this.formatLog(log);
            logFunction(formatted);
            if (helper_1.isErrorLog(log) && log.stack) {
                console.error(log.stack);
            }
        }
        else {
            logFunction(JSON.stringify(Object.assign({ serviceContext: { service: 'worker' }, hostname: os_1.default.hostname() }, log)));
        }
    }
    static formatLog(log) {
        let prefix = `[${log.type}][${log.timestamp.toISOString()}]`;
        if (helper_1.isErrorLog(log)) {
            return `${prefix} ${log.error.message}`;
        }
        return `${prefix} ${log.message}`;
    }
    static getLogFunction(logType) {
        if (logType === typedefs_1.LogType.ERROR) {
            return console.error;
        }
        else if (logType === typedefs_1.LogType.WARN) {
            return console.warn;
        }
        return console.info;
    }
}
Logger.jsonOutput = true;
exports.default = Logger;
//# sourceMappingURL=logger.js.map