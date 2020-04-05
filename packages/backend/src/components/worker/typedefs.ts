import { NodeEventType } from 'services/workflow/typedefs'
import { FlowNode, TraverseOptions } from '@bitpull/worker'

export type Handler = (event: NodeEventType, result: any) => void

export interface WorkerArgs {
    node: FlowNode
    options: TraverseOptions
}

export enum WorkerEvent {
    CREATED = 'CREATED',
    FINISHED = 'FINSIHED'
}
