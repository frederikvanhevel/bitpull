import {
    getWorkflow_getWorkflow,
    getWorkflow_getWorkflow_settings
} from './typedefs/getWorkflow'
import { runWorkflow_runWorkflow } from './typedefs/runWorkflow'

export type WorkflowSettings = Omit<
    getWorkflow_getWorkflow_settings,
    '__typename'
>

export interface Workflow
    extends Omit<getWorkflow_getWorkflow, '__typename' | 'settings'> {
    settings: WorkflowSettings
}

export type WorkflowResult = Omit<runWorkflow_runWorkflow, '__typename'>
