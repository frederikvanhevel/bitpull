import { FlowNode, NodeType } from '../typedefs/node'

export function createNode<T = FlowNode>(
    type: NodeType,
    extra: object = {}
): T {
    // @ts-ignore
    return {
        type,
        ...extra
    }
}
