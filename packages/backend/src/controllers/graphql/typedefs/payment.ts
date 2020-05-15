import { gql } from 'apollo-server'

export const TokenInput = gql`
    input Card {
        object: String!
        brand: String!
        exp_month: Int!
        exp_year: Int!
        last4: String!
    }
    input Token {
        id: String!
        object: String!
        card: Card!
        created: Int!
        livemode: Boolean!
        type: String!
        used: Boolean!
    }

    input TokenInput {
        token: Token!
    }
`

export const PaymentDetails = gql`
    enum Plan {
        FREE
        METERED
        SMALL
        BUSINESS
        PREMIUM
    }
    type PaymentDetails {
        plan: Plan!
        sourceLast4: String
        sourceBrand: String
        trialEndsAt: DateTime
        disabled: Boolean!
        credits: Int!
        earnedCredits: Int!
    }
`

export const Invoice = gql`
    type Invoice {
        amount: Float!
        currency: String!
        date: DateTime!
        status: String!
        url: String!
        description: String
    }
`

export const UsageSummary = gql`
    type UsageSummary {
        total: Int!
        start: DateTime!
        end: DateTime
    }
`
