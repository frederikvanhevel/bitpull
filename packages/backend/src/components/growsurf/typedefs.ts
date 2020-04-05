export interface Participant {
    id: string
    referralCount: number
    monthlyReferralCount: number
    rank: number
    shareUrl: string
    rewards: any[]
    email: string
    firstName: string
    createdAt: number
    referralSource: string
    fraudRiskLevel: FraudRiskLevel
    fraudReasonCode: string
    isWinner: boolean
    shareCount: {
        sms: number
        email: number
        twitter: number
        whatsapp: number
        facebook: number
        linkedin: number
        pinterest: number
        messenger: number
    }
    impressionCount: number
    uniqueImpressionCount: number
    referrals: any[]
    monthlyReferrals: any[]
    metadata: any
}

export interface Reward {
    approved: boolean
    conversionsRequired: number
    couponCode: string
    createdAt: number
    description: string
    imageUrl: string
    limit: number
    title: string
    isReferrer: boolean
    type: string
    rewardId: string
    id: string
    status: string
}

export interface GrowsurfError {
    name: string
    code: string
    message: string
    status: number
    supportUrl: string
    level: string
    timestamp: Date
}

export enum FraudRiskLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export enum CreditStatus {
    CREDIT_AWARDED = 'CREDIT_AWARDED',
    CREDIT_PENDING = 'CREDIT_PENDING'
}

export enum ErrorCode {
    PARTICIPANT_NOT_FOUND = 'PARTICIPANT_NOT_FOUND'
}
