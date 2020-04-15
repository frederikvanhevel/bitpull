import { Node } from 'typedefs/common'
import { NodeType, RootNode } from '@bitpull/worker/lib/typedefs'
import { NODE_PROPERTIES } from './properties'
import { uuid } from 'uuidv4'
import { CollectNode, CollectField } from '@bitpull/worker/lib/typedefs'
import { PaginationNode } from '@bitpull/worker/lib/typedefs'
import { Attributes } from '../modules/common/Selector'

export interface NodeMenuItem {
    type: NodeType
    label: string
    disabled?: boolean
    needsJavascript?: boolean
}

export const capitalize = (text: string) => {
    return text
        .toLowerCase()
        .replace(/(?:^|\s)\S/g, firstLetter => firstLetter.toUpperCase())
}

export const getIcon = (type: NodeType) => {
    return NODE_PROPERTIES[type].icon
}

export const getTitle = (node: Node) => {
    return NODE_PROPERTIES[node.type].label
}

export const getEditor = (node: Node) => {
    return NODE_PROPERTIES[node.type].editor
}

export const isNodeType = (value: string): boolean => {
    return Object.values(NodeType).includes(value as NodeType)
}

export const findUrlAncestor = (node: Node): RootNode | undefined => {
    if (node.type === NodeType.HTML || node.type === NodeType.XML) {
        return node as RootNode
    }

    if (node.parent) {
        return findUrlAncestor(node.parent)
    }

    return undefined
}

export const getMenuItemsByType = (types: NodeType[]): NodeMenuItem[] => {
    const items: NodeMenuItem[] = []

    for (const key in NODE_PROPERTIES) {
        if (types.includes(key as NodeType)) {
            items.push({
                type: key as NodeType,
                label: NODE_PROPERTIES[key as NodeType].shortLabel
            })
        }
    }

    return items
}

export const isEndNode = (node: Node) => {
    return (
        node.type === NodeType.WEBHOOK ||
        node.type === NodeType.DROPBOX ||
        node.type === NodeType.GOOGLE_DRIVE ||
        node.type === NodeType.ONEDRIVE ||
        node.type === NodeType.GITHUB ||
        node.type === NodeType.STORAGE
    )
}

export const isIntegrationNode = (node: Node) => {
    return node.type === NodeType.SLACK || node.type === NodeType.EMAIL
}

export const isExportOnlyNode = (node: Node) => {
    return (
        node.type === NodeType.JSON ||
        node.type === NodeType.EXCEL ||
        node.type === NodeType.CSV ||
        node.type === NodeType.PDF ||
        node.type === NodeType.SCREENSHOT
    )
}

export const isProcessingOnlyNode = (node: Node) => {
    return (
        node.type === NodeType.HTML ||
        node.type === NodeType.XML ||
        node.type === NodeType.CLICK ||
        node.type === NodeType.LOGIN
    )
}

export const isFileNode = (node: Node) => {
    return (
        node.type === NodeType.PDF ||
        node.type === NodeType.EXCEL ||
        node.type === NodeType.CSV ||
        node.type === NodeType.JSON ||
        node.type === NodeType.SCREENSHOT
    )
}

export const isCollectNode = (node: Node): node is CollectNode => {
    return !!(node as CollectNode).fields
}

export const isPaginationNode = (node: Node): node is PaginationNode => {
    return !!(node as PaginationNode).pagination
}

export const isRootNode = (node: Node): node is RootNode => {
    return !!(node as RootNode).link
}

export const getNewCollectField = (): CollectField => ({
    id: uuid(),
    label: '',
    selector: {
        value: '',
        attribute: Attributes.TEXT
    }
})

export const getNewNode = (type: NodeType, parent?: Node): Node => {
    const newNode = { id: uuid(), type }

    if (type === NodeType.HTML || type === NodeType.XML) {
        // TODO if parent is collect node, auto search for links
        // and add them as linked field

        const props =
            parent?.type === NodeType.COLLECT
                ? { linkedField: '' }
                : { link: ' ' }

        return {
            ...newNode,
            ...props
        } as RootNode
    } else if (type === NodeType.COLLECT) {
        return {
            ...newNode,
            fields: [getNewCollectField()]
        } as CollectNode
    }

    return newNode
}
