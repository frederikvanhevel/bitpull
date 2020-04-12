import { Schema, model, Types, Document } from 'mongoose'
import { UserDocument } from 'models/user'

const TRIAL_CREDITS = 200
export const REFERRED_CREDIT_AMOUNT = 1000
export const MAX_REFERRED_CREDITS = 20000

export enum PaymentPlan {
    METERED = 'METERED',
    MONTHLY = 'MONTHLY'
}

export interface Payment {
    id: string
    _id: Types.ObjectId
    owner: string | UserDocument['_id']
    plan: PaymentPlan
    customerId: string
    subscriptionId: string
    meteredPlanId: string
    recurringPlanId?: string
    sourceId?: string
    sourceLast4?: string
    sourceBrand?: string
    trialEndsAt?: Date
    disabled: boolean
    credits: number
    earnedCredits: number
}

export type PaymentDocument = Payment & Document

const PaymentSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    plan: { type: String, required: true },
    customerId: { type: String, required: true },
    subscriptionId: { type: String, required: true },
    meteredPlanId: { type: String, required: true },
    recurringPlanId: { type: String },
    sourceId: { type: String },
    sourceLast4: { type: String },
    sourceBrand: { type: String },
    trialEndsAt: { type: Date },
    disabled: { type: Boolean, default: false },
    credits: {
        type: Number,
        default: TRIAL_CREDITS
    },
    earnedCredits: {
        type: Number,
        default: 0
    }
})

const PaymentModel = model<PaymentDocument>('Payment', PaymentSchema)

export default PaymentModel
