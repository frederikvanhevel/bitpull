import { gql } from 'apollo-boost'

export const HAS_REMAINING_CREDITS = gql`
    query hasCreditsRemaining {
        hasCreditsRemaining
    }
`

export const GET_PAYMENT_DETAILS = gql`
    query getPaymentDetails {
        getPaymentDetails {
            plan
            sourceLast4
            sourceBrand
            trialEndsAt
            disabled
            credits
            earnedCredits
        }
    }
`

export const GET_INVOICES = gql`
    query getInvoices {
        getInvoices {
            amount
            currency
            date
            status
            url
        }
    }
`

export const GET_USAGE_SUMMARY = gql`
    query getUsageSummary {
        getUsageSummary {
            total
            start
            end
        }
        getPaymentDetails {
            credits
        }
    }
`
