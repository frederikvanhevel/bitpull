import { gql } from 'apollo-boost'

export const GET_JOBS = gql`
    query getJobs {
        getJobs {
            id
            name
            workflowId
            workflowName
            hasErrors
            nextRun
            lastRun
            lastFinished
            repeatInterval
            status {
                running
                scheduled
                queued
                completed
                failed
                repeating
                paused
            }
        }
    }
`

export const GET_JOB_LOGS = gql`
    query getJobLogs($id: String!) {
        getJobLogs(id: $id) {
            logs {
                date
                type
                nodeId
                nodeType
                message
            }
        }
    }
`

export * from './typedefs'
