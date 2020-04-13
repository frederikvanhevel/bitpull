export enum ScheduleType {
    ONCE = 'ONCE',
    INTERVAL = 'INTERVAL',
    CRON = 'CRON'
}

export interface JobAttributes {
    workflowId: string
    owner: string
}
