import os from 'os'
import { ErrorLog, Logs, InfoLog, LogType } from './typedefs'
import { isErrorLog } from './helper'

class Logger {
    private static jsonOutput = true
    private static traceId: string

    public static setTraceId(traceId: string) {
        this.traceId = traceId
    }

    public static info(message: string) {
        const data: InfoLog = {
            type: LogType.INFO,
            timestamp: new Date(),
            traceId: Logger.traceId,
            message
        }

        this.executeLog(data)
    }

    public static warn(message: string) {
        const data: InfoLog = {
            type: LogType.WARN,
            timestamp: new Date(),
            traceId: Logger.traceId,
            message
        }

        this.executeLog(data)
    }

    public static error(error: Error, relatedError?: Error) {
        const data: ErrorLog = {
            type: LogType.ERROR,
            timestamp: new Date(),
            traceId: Logger.traceId,
            error,
            message: error.stack,
            relatedError,
            stack: relatedError ? relatedError.stack : error.stack
        }

        this.executeLog(data)
    }

    public static throw(
        error: Error,
        relatedError?: Error
    ): never {
        this.error(error, relatedError)
        throw error
    }

    private static executeLog(log: Logs) {
        const logFunction = this.getLogFunction(log.type)
        if (!this.jsonOutput) {
            const formatted = this.formatLog(log)
            logFunction(formatted)

            if (isErrorLog(log) && log.stack) {
                console.error(log.stack)
            }
        } else {
            logFunction(
                JSON.stringify({
                    serviceContext: { service: 'worker' },
                    hostname: os.hostname(),
                    ...log
                })
            )
        }
    }

    private static formatLog(log: Logs): string {
        let prefix = `[${log.type}][${log.timestamp.toISOString()}]`


        if (isErrorLog(log)) {
            return `${prefix} ${log.error.message}`
        }

        return `${prefix} ${log.message}`
    }

    private static getLogFunction(logType: LogType): Function {
        if (logType === LogType.ERROR) {
            return console.error
        } else if (logType === LogType.WARN) {
            return console.warn
        }

        return console.info
    }
}

export default Logger
