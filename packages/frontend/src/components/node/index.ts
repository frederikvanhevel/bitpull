import { clone } from 'ramda'
import {
    NodeType,
    NodeId,
    RootNode,
    CollectNode
} from '@bitpull/worker/lib/typedefs'
import { PaginationNode } from '@bitpull/worker/lib/typedefs'
import { Node } from 'typedefs/common'

const WATCHABLE_NODES = [NodeType.COLLECT, NodeType.PAGINATION]

export const isNodeUnreachable = (node: Node): boolean => {
    return !!(
        (node.parent &&
            node.parent.type === NodeType.PAGINATION &&
            node.id !== (node.parent as PaginationNode).goToPerPage &&
            node.id !== (node.parent as PaginationNode).gotoOnEnd) ||
        (node.parent && node.parent.disabled) ||
        (node.parent && isNodeUnreachable(node.parent))
    )
}
export const isNodeWatchable = (node: Node) => {
    return WATCHABLE_NODES.includes(node.type)
}

export const hasNodeOfType = (node: Node, type: NodeType) => {
    if (node.type === type) {
        return true
    }

    let outcome = false
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            if (hasNodeOfType(node.children[i], type)) {
                outcome = true
                break
            }
        }
    }

    return outcome
}

interface NodeUpdateOptions {
    nodeToUpdate: Node
    updatedNode?: Node
    nodeIdsToDelete?: NodeId[]
}

export const updateNodesObject = (options: NodeUpdateOptions) => {
    const { updatedNode, nodeToUpdate, nodeIdsToDelete = [] } = options
    const toDelete = new Set<NodeId>(nodeIdsToDelete)

    const updateNode = (node: Node, parent?: Node) => {
        // merge with updated node
        if (updatedNode && node.id === updatedNode.id) {
            node = Object.assign({}, node, updatedNode)
        }

        // update parent reference
        if (parent) {
            node.parent = parent
        }

        // recursively update children
        if (node.children) {
            node.children = node.children
                .filter(n => n && !toDelete.has(n.id))
                .map(n => updateNode(n, node))

            if (!node.children.length) {
                delete node.children
            }
        }
        return node
    }

    return updateNode(clone(nodeToUpdate))
}

export const initializeNodes = (startNode: Node) => {
    const initizalize = (node: Node) => {
        if (!node.children) return node

        for (let i = 0; i < node.children.length; i++) {
            node.children[i] = initializeNodes(node.children[i])
            // @ts-ignore
            node.children[i].parent = node
        }
    }

    initizalize(startNode)

    return startNode
}

export const toJSON = (node: Node, removeChildren?: boolean) => {
    const newNode = clone(node)

    const removeFields = (innerNode: Node) => {
        delete innerNode.parent
        if (removeChildren) delete innerNode.children

        if (innerNode.children) {
            for (let i = 0; i < innerNode.children.length; i++) {
                removeFields(innerNode.children[i])
            }
        }

        return innerNode
    }

    return removeFields(newNode)
}

export const findParentOfType = (
    node: Node,
    types: NodeType[]
): Node | undefined => {
    if (types.includes(node.type)) return node

    if (node.parent) {
        return findParentOfType(node.parent, types)
    }

    return undefined
}

export const findUrlAncestor = (node: Node): Node<RootNode> | undefined => {
    return findParentOfType(node, [NodeType.HTML]) as RootNode
}

export const traverseAncestors = (node: Node) => {
    const traversableTypes = [
        NodeType.HTML,
        NodeType.LOGIN,
        NodeType.WAIT,
        NodeType.CLICK,
        NodeType.SCROLL,
        NodeType.COLLECT
    ]

    if (!node.parent) return toJSON(node, true)

    const urlNode = findParentOfType(node.parent!, traversableTypes)!

    if (!urlNode) return toJSON(urlNode, true)

    let nodes: Node[] = [{ ...urlNode }]
    let parent: Node | undefined = urlNode.parent

    while (parent) {
        if (traversableTypes.includes(parent.type)) {
            nodes.push({ ...parent })
        }

        parent = parent.parent
    }

    let root = { ...nodes.pop()! }
    delete root.children
    let lastChild = root
    while (nodes.length) {
        const child = { ...nodes.pop()! }
        delete child.children

        if (child.type === NodeType.COLLECT) {
            ;(child as CollectNode).limit = 1
        }

        lastChild.children = [child]
        lastChild = child
    }

    return toJSON(root)
}
