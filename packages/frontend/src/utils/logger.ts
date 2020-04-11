import stackdriver from 'services/stackdriver'

class Logger {
    private static LOG_LEVEL = parseInt(process.env.LOG_LEVEL || '3', 10)

    public static info(message: string) {
        if (Logger.LOG_LEVEL < 3) return
        console.info(message)
    }

    public static warn(message: string) {
        if (Logger.LOG_LEVEL < 2) return
        console.warn(message)
    }

    public static async error(originalError: Error) {
        if (Logger.LOG_LEVEL < 1) return
        console.error(originalError)
        stackdriver.error(originalError)
    }

    public static throw(error: Error): never {
        Logger.error(error)
        throw error
    }

    public static setLogLevel(level: number) {
        Logger.LOG_LEVEL = level
    }

    public static setUser(userId: string) {
        stackdriver.setUser(userId)
    }
}

export default Logger
