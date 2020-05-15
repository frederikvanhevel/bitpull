export enum StripePaymentPlan {
    FREE = 'free',
    METERED = 'metered',
    SMALL = 'small',
    BUSINESS = 'business',
    PREMIUM = 'premium'
}

export interface StripeSubscription {
    customerId: string
    subscriptionId: string
    planId: string
    sourceId?: string
    sourceLast4?: string
    sourceBrand?: string
    trialEndsAt?: Date
}

export interface Invoice {
    amount: number
    currency: string
    date: Date
    status:
        | 'draft'
        | 'open'
        | 'paid'
        | 'uncollectible'
        | 'void'
        | 'deleted'
        | null
    url?: string | null
    description?: string | null
}

export interface UsageSummary {
    total: number
    start: Date
    end?: Date
}
