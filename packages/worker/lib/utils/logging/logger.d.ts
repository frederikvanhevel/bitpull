declare class Logger {
    private static jsonOutput;
    private static traceId;
    static setTraceId(traceId: string): void;
    static info(message: string): void;
    static warn(message: string): void;
    static error(error: Error, relatedError?: Error): void;
    static throw(error: Error, relatedError?: Error): never;
    private static executeLog;
    private static formatLog;
    private static getLogFunction;
}
export default Logger;
