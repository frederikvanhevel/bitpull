import { Document, Model, Schema, model, Types } from 'mongoose'
import { UserDocument } from 'models/user'
import { AgendaJob } from 'models/agenda-job'
import { WorkflowDocument } from 'models/workflow'
import { getLatestJobs } from './statics'

export interface Job {
    _id: Types.ObjectId
    id: string
    name: string
    workflow: string | WorkflowDocument['_id']
    hasErrors: boolean
    agendaJob: string | AgendaJob['_id']
    owner: string | UserDocument['_id']
    updatedAt: Date
    createdAt: Date
}

export type JobDocument = Job & Document

interface JobModel extends Model<JobDocument> {
    getLatestJobs(
        userId: string | UserDocument['_id'],
        limit: number,
        skip: number
    ): Promise<Job[]>
}

const JobSchema = new Schema(
    {
        name: {
            type: String,
            trim: true
        },
        workflow: {
            type: Schema.Types.ObjectId,
            ref: 'Workflow',
            required: true
        },
        agendaJob: {
            type: Schema.Types.ObjectId,
            ref: 'AgendaJob',
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        hasErrors: {
            type: Boolean,
            default: false
        },
        lastDuration: Number
    },
    { timestamps: true }
)

JobSchema.statics.getLatestJobs = getLatestJobs

const JobModel = model<JobDocument, JobModel>('Job', JobSchema)

export default JobModel
