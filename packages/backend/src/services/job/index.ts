import JobModel, { Job } from 'models/job'
import Scheduler from 'components/scheduler'
import { NotFoundError, NotAllowedError, LimitReachedError } from 'utils/errors'
import AgendaJobModel from 'models/agenda-job'
import LogModel from 'models/log'
import { JobType } from 'components/scheduler/typedefs'
import PaymentService from 'services/payment'
import MailService from 'services/mail'
import UserModel, { User } from 'models/user'
import Segment, { TrackingEvent } from 'components/segment'
import { addSeconds } from 'date-fns'
import Agenda from 'agenda'
import WorkflowModel from 'models/workflow'
import LogService from 'services/log'
import { ParseResult, Status } from '@bitpull/worker'
import Logger from 'utils/logging/logger'
import AnalyticsService from 'services/analytics'
import { ScheduleType, JobAttributes, JobArgs } from './typedefs'

export const JOB_LIMIT = 50

const getJobs = async (user: User) => {
    return await JobModel.getLatestJobs(user._id, JOB_LIMIT, 0)
}

const createJob = async (
    user: User,
    name: string,
    workflowId: string,
    type: ScheduleType,
    schedule: any
) => {
    const count = await JobModel.countDocuments({
        owner: user._id
    })

    if (count >= JOB_LIMIT) {
        throw new LimitReachedError()
    }

    const jobProcessor = JobType.RUN_WORKFLOW
    const agendaJob = Scheduler.getInstance()
        .create<JobAttributes>(jobProcessor, { workflowId, owner: user.id })
        .unique({ 'data.processId': workflowId })
        .enable()

    if (type === ScheduleType.IMMEDIATELY) {
        agendaJob.schedule(addSeconds(new Date(), 5))
    } else if (type !== ScheduleType.ONCE) {
        agendaJob.repeatEvery(schedule, { skipImmediate: true })
    } else {
        agendaJob.schedule(new Date(schedule))
    }

    const savedJob = await agendaJob.save()

    const job = {
        name,
        workflow: workflowId,
        agendaJob: savedJob.attrs._id,
        owner: user._id,
        updatedAt: new Date()
    } as Job

    Segment.track(TrackingEvent.JOB_CREATE, user)

    // only one job of the same workflow at a time
    return await JobModel.findOneAndUpdate(
        { agendaJob: agendaJob.attrs._id },
        job,
        { upsert: true, new: true }
    )
}

const removeJob = async (user: User, jobId: string) => {
    const jobToRemove = await JobModel.findById(jobId)

    if (!jobToRemove) {
        throw new NotFoundError()
    }

    if (!jobToRemove.owner.equals(user.id)) {
        throw new NotAllowedError()
    }

    Segment.track(TrackingEvent.JOB_REMOVE, user)

    await Scheduler.cancelJob(jobToRemove.agendaJob)
    return await jobToRemove.remove()
}

const pauseJob = async (user: User, jobId: string) => {
    const jobToUpdate = await JobModel.findById(jobId)

    if (!jobToUpdate) {
        throw new NotFoundError()
    }

    if (!jobToUpdate.owner.equals(user.id)) {
        throw new NotAllowedError()
    }

    Segment.track(TrackingEvent.JOB_PAUSE, user)

    await AgendaJobModel.findByIdAndUpdate(jobToUpdate.agendaJob, {
        $set: { disabled: true }
    })
}

const resumeJob = async (user: User, jobId: string) => {
    const jobToUpdate = await JobModel.findById(jobId)
    const hasCredits = await PaymentService.hasCreditsRemaining(user._id)

    if (!jobToUpdate) {
        throw new NotFoundError()
    }

    if (!jobToUpdate.owner.equals(user.id) || !hasCredits) {
        throw new NotAllowedError()
    }

    Segment.track(TrackingEvent.JOB_RESUME, user)

    await AgendaJobModel.findByIdAndUpdate(jobToUpdate.agendaJob, {
        $unset: { disabled: 1 }
    })
}

const getJobLogs = async (user: User, jobId: string) => {
    return LogModel.findOne({ job: jobId })
}

const reportResult = async (
    user: User,
    jobId: string,
    hasErrors: boolean,
    duration: number
) => {
    const job = await JobModel.findById(jobId)

    if (!job) {
        throw new NotFoundError()
    }

    if (!job.hasErrors && hasErrors && user.settings.failedJobEmail) {
        // new errors, report to user
        MailService.sendJobHasErrorsEmail(user.email, job.name)
    }

    await JobModel.updateOne(
        { _id: jobId },
        {
            $set: { hasErrors, lastDuration: duration }
        }
    )
}

const checkIfJobNameExists = async (user: User, name: string) => {
    const job = await JobModel.findOne({
        owner: user._id,
        name
    }).lean()

    return !!job
}

const preRun = async (agendaJob: Agenda.Job): Promise<JobArgs> => {
    const { workflowId } = agendaJob.attrs.data as JobAttributes

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

    Segment.track(TrackingEvent.JOB_RUN, user)

    const hasCredits = await PaymentService.hasCreditsRemaining(job.owner)

    if (!hasCredits) {
        agendaJob.disable()
        throw new Error('User has no remaining credits')
    }

    const workflow = await WorkflowModel.findById(workflowId)

    if (!workflow) {
        throw new Error('Workflow not found')
    }

    return {
        user,
        job,
        workflow
    }
}

const postRun = async (jobArgs: JobArgs, result: ParseResult) => {
    const { user, job, workflow } = jobArgs

    await LogService.saveJobLog(job.id, workflow.id, result)

    if (
        result.status === Status.ERROR ||
        result.errors.length === result.logs.length - 1
    ) {
        Logger.warn(`Job failed: ${JSON.stringify(result.errors)}`)
        throw new Error(`Workflow failed for job ${job._id}`)
    }

    if (result.stats.pageCount > 0) {
        await PaymentService.reportUsage(user, result.stats)
    }

    await AnalyticsService.save(job, result.status, result.stats)

    await reportResult(
        user,
        job.id,
        result.errors.length > 0,
        result.stats.duration
    )
}

const postRunFail = async (agendaJob: Agenda.Job, error: Error) => {
    const job = await JobModel.findOne({
        agendaJob: agendaJob.attrs._id
    })

    if (!job) return

    Logger.error(new Error(`Job with id ${job._id} failed`), error)

    await AnalyticsService.save(job, Status.ERROR)
}

const JobService = {
    getJobs,
    createJob,
    removeJob,
    pauseJob,
    resumeJob,
    getJobLogs,
    reportResult,
    checkIfJobNameExists,
    preRun,
    postRun,
    postRunFail
}

export default JobService
