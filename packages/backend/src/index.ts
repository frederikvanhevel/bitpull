import dotenv from 'dotenv'
dotenv.config()
import Server from 'server'
import Scheduler from 'components/scheduler'
import JobController from 'controllers/jobs'
import Segment from 'components/segment'
import { getMissingVars } from 'utils/config'

const missingVars = getMissingVars()

if (missingVars.length) {
    throw new Error(`${missingVars.join(' ')} variables are missing`)
}

Segment.initialize()
Scheduler.start()

Server.start()

JobController.startJobProcessor()
JobController.startStorageCleanup()
JobController.startAnalyticsCleanup()

const shutdown = async () => {
    await Scheduler.shutdown()
    // eslint-disable-next-line no-process-exit
    process.exit(0)
}

// temporary workaround for workflow cancels
process.on('unhandledRejection', reason => {
    // @ts-ignore
    if (reason?.message !== 'Operation was cancelled') throw reason
})
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
