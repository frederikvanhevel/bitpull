import { NodeType, FlowNode, CollectNode, PaginationNode, MultipleHtmlNode, MultipleClickNode } from "@bitpull/worker"

const ALLOWED_LINKS = 2

export const limitFollowedLinks = (node: FlowNode) => {
    const addLimit = (innerNode: FlowNode) => {
        if (innerNode.type === NodeType.COLLECT) {
            (innerNode as CollectNode).limit = ALLOWED_LINKS
        }

        if (innerNode.type === NodeType.HTML_MULTIPLE) {
            (innerNode as MultipleHtmlNode).limit = ALLOWED_LINKS
        }

        if (innerNode.type === NodeType.PAGINATION) {
            (innerNode as PaginationNode).linkLimit = ALLOWED_LINKS
        }

        if (innerNode.type === NodeType.CLICK_MULTIPLE) {
            (innerNode as MultipleClickNode).limit = ALLOWED_LINKS
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
