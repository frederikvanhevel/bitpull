import os from 'os'
import { Schema, model, Document } from 'mongoose'
import { JobAttributes } from 'agenda'

export type AgendaJob = JobAttributes & Document

const AgendaJobSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    data: {
        workflowId: {
            type: String,
            index: true
        }
    },
    type: {
        type: String,
        default: 'normal',
        enum: ['normal', 'single']
    },
    priority: {
        type: Number,
        default: 0,
        min: -20,
        max: 20,
        index: true
    },
    nextRunAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    lastModifiedBy: {
        type: String,
        default: process.env.AGENDA_NAME || `${os.hostname()}_${process.pid}`
    },
    lockedAt: {
        type: Date,
        index: true
    },
    lastFinishedAt: Date,
    disabled: Boolean
})

const AgendaJobModel = model<AgendaJob>(
    'AgendaJob',
    AgendaJobSchema,
    'agendaJobs'
)

export default AgendaJobModel
