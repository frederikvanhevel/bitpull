import { FlowNode, NodeType } from '../../../typedefs/node'

export type WaitNode = FlowNode & {
    type: NodeType.WAIT
    delay: number
}
