import { User } from 'models/user'
import { Job } from 'models/job'
import { Workflow } from 'models/workflow'

export enum ScheduleType {
    IMMEDIATELY = 'IMMEDIATELY',
    ONCE = 'ONCE',
    INTERVAL = 'INTERVAL',
    CRON = 'CRON'
}

export interface JobAttributes {
    workflowId: string
    owner: string
}

export interface JobArgs {
    user: User
    job: Job
    workflow: Workflow
}
