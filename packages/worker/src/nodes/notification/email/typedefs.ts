import { FlowNode, NodeType } from '../../../typedefs/node'

export type EmailNode = FlowNode & {
    type: NodeType.EMAIL
}
