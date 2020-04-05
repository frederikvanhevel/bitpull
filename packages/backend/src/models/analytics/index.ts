import { Document, Schema, Model, model } from 'mongoose'
import { UserDocument } from '../user'
import {
    getAnalyticsPerJob,
    getAnalyticsForPeriod,
    GetAnalyticsForPeriodResult,
    getAnalyticsPerJobResult
} from './statics'

export interface Analytics {
    date: Date
    completed: number
    failed: number
    job: string
    owner: string | UserDocument['_id']
}

export { GetAnalyticsForPeriodResult, getAnalyticsPerJobResult }

type AnalyticsDocument = Analytics & Document

interface AnalyticsModel extends Model<AnalyticsDocument> {
    getAnalyticsPerJob(
        userId: string | UserDocument['_id'],
        date: Date
    ): Promise<getAnalyticsPerJobResult[]>
    getAnalyticsForPeriod(
        userId: string | UserDocument['_id'],
        date: Date
    ): Promise<GetAnalyticsForPeriodResult[]>
}

const AnalyticsSchema = new Schema({
    date: {
        type: Date,
        index: true,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    duration: {
        type: Number
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
        index: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
})

AnalyticsSchema.statics.getAnalyticsPerJob = getAnalyticsPerJob
AnalyticsSchema.statics.getAnalyticsForPeriod = getAnalyticsForPeriod

const AnalyticsModel = model<AnalyticsDocument, AnalyticsModel>(
    'Analytics',
    AnalyticsSchema
)

export default AnalyticsModel
