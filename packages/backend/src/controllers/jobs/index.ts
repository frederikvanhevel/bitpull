import Agenda from 'agenda'
import Scheduler from 'components/scheduler'
import { JobType, Repetition } from 'components/scheduler/typedefs'
import Logger from 'utils/logging/logger'
import AnalyticsService from 'services/analytics'
import { ParseResult } from '@bitpull/worker'
import StorageService from 'services/storage'
import { ResourceType } from 'models/storage'
import WorkflowService from 'services/workflow'
import JobService from 'services/job'
import { NodeEventType } from 'services/workflow/typedefs'

const startJobProcessor = () => {
    const handler = async (agendaJob: Agenda.Job, done: Function) => {
        try {
            const jobArgs = await JobService.preRun(agendaJob)
            const { user, job, workflow } = jobArgs

            const result: ParseResult = await WorkflowService.run(
                user,
                workflow.node,
                job.name,
                ResourceType.JOB,
                (event, data) => {
                    if (event === NodeEventType.STORAGE) {
                        StorageService.save(workflow.owner, {
                            resourceType: ResourceType.JOB,
                            resourceId: job._id,
                            resourceName: job.name,
                            data: data as any
                        }).catch(Logger.error)
                    }
                }
            )

            await JobService.postRun(jobArgs, result)

            done()
        } catch (error) {
            done(error || new Error('Unknown error'))
        }
    }

    const onSuccess = (job: Agenda.Job) => {
        Logger.info(`Finished job ${job.attrs._id}`)
    }

    const onFail = async (error: Error, agendaJob: Agenda.Job) => {
        try {
            await JobService.postRunFail(agendaJob, error)
        } catch (error) {
            Logger.error(error)
        }
    }

    Scheduler.runJob(JobType.RUN_WORKFLOW, handler, onSuccess, onFail)
}

const startStorageCleanup = () => {
    Scheduler.scheduleJob({
        name: JobType.CLEAN_STORAGE,
        job: async () => {
            try {
                Logger.info('Starting storage cleanup')
                await StorageService.clean()
                Logger.info('Storage cleanup finished')
            } catch (error) {
                Logger.error(new Error('Error cleaning storage'), error)
            }
        },
        repeat: Repetition.DAILY
    })
}

const startAnalyticsCleanup = () => {
    Scheduler.scheduleJob({
        name: JobType.CLEAN_ANALYTICS,
        job: async () => {
            try {
                Logger.info('Starting analytics cleanup')
                await AnalyticsService.clean()
                Logger.info('Analytics cleanup finished')
            } catch (error) {
                Logger.error(new Error('Error cleaning analytics'), error)
            }
        },
        repeat: Repetition.DAILY
    })
}

const JobController = {
    startJobProcessor,
    startStorageCleanup,
    startAnalyticsCleanup
}

export default JobController
