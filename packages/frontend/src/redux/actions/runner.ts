import {
    RUN_NODE,
    RUN_NODE_COMPLETE,
    RUN_NODE_CANCEL
} from '../constants/runner'
import { WorkflowResult } from 'queries/workflow'

export interface RunNode {
    type: typeof RUN_NODE
}

export interface RunNodeCompleteAction {
    type: typeof RUN_NODE_COMPLETE
    payload: WorkflowResult
}

export const runNode = () => {
    return {
        type: RUN_NODE
    }
}

export const cancelRunNode = () => {
    return {
        type: RUN_NODE_CANCEL
    }
}

export type Actions = RunNode
