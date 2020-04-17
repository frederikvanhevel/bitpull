import { FlowNode, NodeType } from '../../../typedefs/node'
import { HTMLSelector } from '../selectors'

export type CollectField = {
    id: string
    label: string
    selector: HTMLSelector
}

export type CollectNode = FlowNode & {
    type: NodeType.COLLECT
    fields: CollectField[]
    append?: boolean
    limit?: number
}

export type CollectParseResult = object | object[]
