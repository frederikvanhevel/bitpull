export enum LogType {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

export interface Log {
    type: LogType
    timestamp: Date
    traceId: string
}

export interface InfoLog extends Log {
    message: string
}

export interface ErrorLog extends Log {
    type: LogType.ERROR
    message?: string
    error: Error
    relatedError?: Error
    stack?: string
}

export type Logs = InfoLog | ErrorLog
