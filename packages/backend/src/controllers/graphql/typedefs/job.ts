import { gql } from 'apollo-server'

export const Job = gql`
    type AgendaJob {
        lastRunAt: DateTime
        nextRunAt: DateTime
        lastFinishedAt: DateTime
        disabled: Boolean
    }
    type Job {
        id: String!
        name: String!
        description: String!
        workflow: Workflow!
        agendaJob: AgendaJob!
        owner: String!
        updatedAt: DateTime!
        createdAt: DateTime!
    }
    type JobStatus {
        running: Boolean!
        scheduled: Boolean!
        queued: Boolean!
        completed: Boolean!
        failed: Boolean!
        repeating: Boolean!
        paused: Boolean!
    }
    type ScheduledJob {
        id: String!
        name: String!
        workflowId: String!
        workflowName: String!
        hasErrors: Boolean
        status: JobStatus!
        nextRun: DateTime
        lastRun: DateTime
        lastFinished: DateTime
        repeatInterval: String
    }
`

export const JobInput = gql`
    enum ScheduleType {
        ONCE
        INTERVAL
        CRON
    }
    input JobInput {
        name: String!
        workflowId: String!
        type: ScheduleType!
        schedule: String!
    }
`
