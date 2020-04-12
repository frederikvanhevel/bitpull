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

// Template paramaters
type TemplateParams =
    | VerifyEmailParams
    | ForgotPasswordParams
    | JobHasErrorsParams
    | PaymentFailedParams
    | TrialWillEndParams
    | ReferralAwardedParams

export interface EmailOptions {
    to: string
    template: Template
    from?: { name: string; email: string }
    params?: TemplateParams
}
