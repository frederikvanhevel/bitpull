import { Template } from '.'

export interface VerifyEmailParams {
    link: string
}

export interface ForgotPasswordParams {
    link: string
}

export interface JobHasErrorsParams {
    jobName: string
    link: string
}

export interface PaymentFailedParams {
    link: string
}

export interface TrialWillEndParams {
    link: string
}

export interface ReferralAwardedParams {
    referredUser: string
    credits: number
    referralLink: string
}

export interface FeedbackParams {
    id: string
    name: string
    type: string
    question: string
}

// Template paramaters
type TemplateParams =
    | VerifyEmailParams
    | ForgotPasswordParams
    | JobHasErrorsParams
    | PaymentFailedParams
    | TrialWillEndParams
    | ReferralAwardedParams
    | FeedbackParams

export interface EmailOptions {
    to: string
    template: Template
    from?: { name: string; email: string }
    params?: TemplateParams
}
