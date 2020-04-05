import { gql } from 'apollo-server'

export const AnalyticsPeriod = gql`
    enum AnalyticsPeriod {
        LAST_WEEK
        LAST_MONTH
    }
`

export const AnalyticsResponse = gql`
    # scalar DateTime
    type TotalsPerDay {
        date: DateTime!
        completed: Int!
        failed: Int!
        total: Int!
    }
    type TotalsPerJob {
        job: Job!
        completed: Int!
        failed: Int!
        total: Int!
    }
`
