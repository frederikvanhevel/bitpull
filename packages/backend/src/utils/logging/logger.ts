import os from 'os'
import { User } from 'models/user'
import Config from 'utils/config'
import { ErrorLog, Logs, InfoLog, LogType } from './typedefs'
import { isErrorLog } from './helper'
import { getTraceId } from './tracing'

class Logger {
    public static jsonOutput = Config.NODE_ENV === 'production'

    public static info(message: string, user?: User) {
        const data: InfoLog = {
            type: LogType.INFO,
            timestamp: new Date(),
            traceId: getTraceId(),
            userId: user?._id.toHexString(),
            message
        }

        this.executeLog(data)
    }

    public static warn(message: string) {
        const data: InfoLog = {
            type: LogType.WARN,
            timestamp: new Date(),
            traceId: getTraceId(),
            message
        }

        this.executeLog(data)
    }

    public static error(error: Error, relatedError?: Error, user?: User) {
        const data: ErrorLog = {
            type: LogType.ERROR,
            timestamp: new Date(),
            traceId: getTraceId(),
            error,
            message: error.stack,
            relatedError,
            stack: relatedError ? relatedError.stack : error.stack,
            userId: user?.id || user?._id.toHexString()
        }

        this.executeLog(data)
    }

    public static throw(
        error: Error,
        relatedError?: Error,
        user?: User
    ): never {
        this.error(error, relatedError, user)
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
                    serviceContext: { service: 'backend' },
                    hostname: os.hostname(),
                    ...log
                })
            )
        }
    }

    private static formatLog(log: Logs): string {
        let prefix = `[${log.type}][${log.timestamp.toISOString()}]`

        if (log.userId) {
            prefix += `[${log.userId}]`
        }

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
