import { FlowNode, NodeType } from '../../../typedefs/node'

export type JsonNode = FlowNode & {
    type: NodeType.JSON
}
