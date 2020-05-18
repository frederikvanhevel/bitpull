import Agenda from 'agenda'
import mongoose from 'mongoose'
import { DEFAULT_TIMEOUT } from 'services/workflow'
import { JobProcessorDefinition, JobType } from './typedefs'

let scheduler: Agenda

export const TIMEOUT = 1200000 // 20 minutes

const getInstance = () => {
    return scheduler
}

const start = async () => {
    scheduler = new Agenda({
        // @ts-ignore
        mongo: mongoose.connection,
        defaultLockLifetime: TIMEOUT
    })
    await scheduler.start()
}

const scheduleJob = (definition: JobProcessorDefinition) => {
    const { name, job, repeat, onSuccess, onFail } = definition
    const options = {
        lockLifetime: DEFAULT_TIMEOUT
    }

    scheduler.define<JobProcessorDefinition>(name, options, job)

    if (repeat) scheduler.every<JobProcessorDefinition>(repeat, name)
    if (onSuccess) scheduler.on(`success:${name}`, onSuccess)
    if (onFail) scheduler.on(`fail:${name}`, onFail)
}

const runJob = (
    type: JobType,
    handler: JobProcessorDefinition['job'],
    onSuccess: (agendaJob: Agenda.Job) => void,
    onFail: (error: Error, agendaJob: Agenda.Job) => void,
    concurrency: number = 10
) => {
    scheduler.define(type, { concurrency }, handler)
    scheduler.on(`success:${type}`, onSuccess)
    scheduler.on(`fail:${type}`, onFail)
}

const cancelJob = async (id: string) => {
    await scheduler.cancel({ _id: mongoose.Types.ObjectId(id) })
}

const shutdown = async () => {
    if (!scheduler) return
    await scheduler.stop()
}

const Scheduler = {
    getInstance,
    start,
    scheduleJob,
    runJob,
    cancelJob,
    shutdown
}

export default Scheduler
