import { gql } from 'apollo-boost'

export const GET_ANALYTICS_PER_DAY = gql`
    query getTotalsPerDay($period: AnalyticsPeriod!) {
        getTotalsPerDay(period: $period) {
            date
            completed
            failed
            total
        }
    }
`

export const GET_ANALYTICS_PER_JOB = gql`
    query getTotalsPerJob($period: AnalyticsPeriod!) {
        getTotalsPerJob(period: $period) {
            job {
                id
                name
            }
            completed
            failed
            total
        }
    }
`
