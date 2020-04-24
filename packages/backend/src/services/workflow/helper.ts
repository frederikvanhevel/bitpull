import { NodeType, FlowNode, CollectNode, PaginationNode } from "@bitpull/worker"

export const limitFollowedLinks = (node: FlowNode) => {
    const addLimit = (innerNode: FlowNode) => {
        if (innerNode.type === NodeType.COLLECT) {
            (innerNode as CollectNode).limit = 1
        }

        if (innerNode.type === NodeType.PAGINATION) {
            (innerNode as PaginationNode).linkLimit = 1
        }

        if (innerNode.children) {
            for (let i = 0; i < innerNode.children.length; i++) {
                addLimit(innerNode.children[i])
            }
        }

        return innerNode
    }

    return addLimit(node)
}
