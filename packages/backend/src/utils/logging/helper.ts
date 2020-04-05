import { Logs, ErrorLog } from './typedefs'

export const isErrorLog = (log: Logs): log is ErrorLog => {
    if ((log as ErrorLog).error) {
        return true
    }
    return false
}
