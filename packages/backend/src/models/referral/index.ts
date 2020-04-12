import { Document, Schema, model } from 'mongoose'
import { UserDocument } from 'models/user'

export enum ReferralStatus {
    PENDING = 'PENDING',
    AWARDED = 'AWARDED'
}

export interface Referral {
    referrer: string | UserDocument['_id']
    referree: string | UserDocument['_id']
    status: ReferralStatus
}

export type ReferralDocument = Referral & Document

const ReferralSchema = new Schema({
    referrer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    referree: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'AWARDED'],
        default: 'PENDING'
    }
})

const ReferralModel = model<ReferralDocument>('Referral', ReferralSchema)

export default ReferralModel
