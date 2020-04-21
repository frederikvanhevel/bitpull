import { FlowNode, NodeType } from '../../../typedefs/node'
import { HTMLSelector } from '../selectors'

export type ScrollNode = FlowNode & {
    type: NodeType.SCROLL,
    element?: HTMLSelector
}
