import { FlowNode, NodeType } from '../../../typedefs/node'

export type StorageNode = FlowNode & {
    type: NodeType.STORAGE
}
