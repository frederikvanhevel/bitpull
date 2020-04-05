import LogModel from 'models/log'
import { ParseResult } from '@bitpull/worker'

const saveJobLog = (jobId: string, workflowId: string, result: ParseResult) => {
    return LogModel.findOneAndUpdate(
        { job: jobId },
        {
            status: result.status,
            logs: result.logs,
            errors: result.errors,
            workflow: workflowId
        },
        { upsert: true }
    )
}

const LogService = {
    saveJobLog
}

export default LogService
