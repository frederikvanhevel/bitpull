import Agenda from 'agenda'
import Scheduler, { TIMEOUT } from 'components/scheduler'
import { JobType, Repetition } from 'components/scheduler/typedefs'
import Logger from 'utils/logging/logger'
import AnalyticsService from 'services/analytics'
import WorkflowModel from 'models/workflow'
import { Status, ParseResult } from '@bitpull/worker'
import JobModel, { Job } from 'models/job'
import StorageService from 'services/storage'
import { ResourceType } from 'models/storage'
import WorkflowService from 'services/workflow'
import PaymentService from 'services/payment'
import LogService from 'services/log'
import UserModel, { User } from 'models/user'
import JobService from 'services/job'
import { NodeEventType } from 'services/workflow/typedefs'
import Timer from './timer'

const startJobProcessor = () => {
    const handler = async (agendaJob: Agenda.Job, done: Function) => {
        let timeoutHandler

        try {
            const timer = new Timer()
            const { workflowId } = agendaJob.attrs.data
            const job: Job | null = await JobModel.findOne({
                agendaJob: agendaJob.attrs._id
            })

            if (!job) {
                throw new Error('Job not found')
            }

            const user: User | null = await UserModel.findById(job.owner).lean()

            if (!user) {
                throw new Error('User not found')
            }

            const paymentReady = await PaymentService.hasPaymentMethod(
                job.owner
            )

            if (!paymentReady) {
                agendaJob.disable()
                throw new Error('User has no payment details')
            }

            const workflow = await WorkflowModel.findById(workflowId).lean()

            if (!workflow) {
                throw new Error('Workflow not found')
            }

            timeoutHandler = setTimeout(() => {
                throw new Error('Job timed out')
            }, TIMEOUT)

            timer.start()

            const result: ParseResult = await WorkflowService.run(
                user,
                workflow.node,
                job.name,
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

            const durationInSeconds = timer.end()

            await LogService.saveJobLog(job.id, workflowId, result)

            if (
                result.status === Status.ERROR ||
                result.errors.length === result.logs.length - 1
            ) {
                throw new Error(`Workflow failed for job ${job._id}`)
            }

            if (durationInSeconds > 0) {
                await PaymentService.reportUsage(user, durationInSeconds)
                Logger.info(
                    `Billed user ${job.owner} for ${durationInSeconds} seconds`
                )
            }

            await AnalyticsService.save(job, result.status, durationInSeconds)
            await JobService.reportResult(
                user,
                job.id,
                result.errors.length > 0,
                durationInSeconds
            )

            done()
        } catch (error) {
            done(error)
        } finally {
            timeoutHandler && clearTimeout(timeoutHandler)
        }
    }

    const onSuccess = (job: Agenda.Job) => {
        Logger.info(`Finished job ${job.attrs._id}`)
    }

    const onFail = async (error: Error, agendaJob: Agenda.Job) => {
        const job = await JobModel.findOne({
            agendaJob: agendaJob.attrs._id
        })

        if (!job) return

        Logger.error(new Error(`Job with id ${job._id} failed`), error)

        await AnalyticsService.save(job, Status.ERROR)
    }

    Scheduler.runJob(JobType.RUN_WORKFLOW, handler, onSuccess, onFail)
}

const startStorageCleanup = () => {
    Scheduler.scheduleJob({
        name: JobType.CLEAN_STORAGE,
        job: async () => {
            Logger.info('Starting storage cleanup')
            await StorageService.clean()
            Logger.info('Storage cleanup finished')
        },
        repeat: Repetition.DAILY
    })
}

const startAnalyticsCleanup = () => {
    Scheduler.scheduleJob({
        name: JobType.CLEAN_ANALYTICS,
        job: async () => {
            Logger.info('Starting analytics cleanup')
            await AnalyticsService.clean()
            Logger.info('Analytics cleanup finished')
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
