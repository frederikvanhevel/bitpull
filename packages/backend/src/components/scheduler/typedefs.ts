import Agenda from 'agenda'

export enum Repetition {
    DAILY = '1 day'
}

export interface JobProcessorDefinition {
    name: string
    job: (
        job: Agenda.Job<JobProcessorDefinition>,
        done: (err?: Error) => void
    ) => void
    repeat?: Repetition
    onSuccess?: (...args: any[]) => void
    onFail?: (...args: any[]) => void
}

export enum JobType {
    RUN_WORKFLOW = 'RUN_WORKFLOW',
    CLEAN_ANALYTICS = 'CLEAN_ANALYTICS',
    CLEAN_STORAGE = 'CLEAN_STORAGE'
}
