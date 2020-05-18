import { Schema, model, Types, Document } from 'mongoose'
import { UserDocument } from 'models/user'
import Config from 'utils/config'

const TRIAL_CREDIT_AMOUNT = Config.TRIAL_CREDIT_AMOUNT
export const REFERRED_CREDIT_AMOUNT = 50
export const MAX_REFERRED_CREDITS = 1000

export enum PaymentPlan {
    FREE = 'FREE',
    METERED = 'METERED',
    SMALL = 'SMALL',
    BUSINESS = 'BUSINESS',
    PREMIUM = 'PREMIUM'
}

export const PLAN_CREDIT_AMOUNT: Record<PaymentPlan, number> = {
    [PaymentPlan.FREE]: TRIAL_CREDIT_AMOUNT,
    [PaymentPlan.METERED]: TRIAL_CREDIT_AMOUNT,
    [PaymentPlan.SMALL]: 500,
    [PaymentPlan.BUSINESS]: 1000,
    [PaymentPlan.PREMIUM]: 2500
}

export interface Payment {
    id: string
    _id: Types.ObjectId
    owner: string | UserDocument['_id']
    plan: PaymentPlan
    customerId: string
    subscriptionId: string
    planId: string
    sourceId?: string
    sourceLast4?: string
    sourceBrand?: string
    trialEndsAt?: Date
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
    planId: { type: String },
    sourceId: { type: String },
    sourceLast4: { type: String },
    sourceBrand: { type: String },
    trialEndsAt: { type: Date },
    credits: {
        type: Number,
        default: TRIAL_CREDIT_AMOUNT
    },
    earnedCredits: {
        type: Number,
        default: 0
    }
})

const PaymentModel = model<PaymentDocument>('Payment', PaymentSchema)

export default PaymentModel
