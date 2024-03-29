import { Node } from 'typedefs/common'
import {
    NodeType,
    HtmlNode,
    MultipleHtmlNode,
    LinkedHtmlNode,
    MultipleClickNode
} from '@bitpull/worker/lib/typedefs'
import { NODE_PROPERTIES } from './properties'
import { uuid } from 'uuidv4'
import { CollectNode, CollectField } from '@bitpull/worker/lib/typedefs'
import { PaginationNode } from '@bitpull/worker/lib/typedefs'
import { Attributes } from '../modules/common/Selector'
import { getDefaultProps } from './defaults'
import Logger from 'utils/logger'

export interface NodeMenuItem {
    type: NodeType
    label: string
    shortLabel: string
    disabled?: boolean
    needsJavascript?: boolean
}

export const capitalize = (text: string) => {
    return text
        .toLowerCase()
        .replace(/(?:^|\s)\S/g, firstLetter => firstLetter.toUpperCase())
}

const getNodeProperty = (type: NodeType) => {
    const property = NODE_PROPERTIES[type]
    if (!property) Logger.error(new Error(`No property found for ${type}`))
    return property
}

export const getIcon = (type: NodeType) => {
    return getNodeProperty(type).icon
}

export const getTitle = (node: Node) => {
    return getNodeProperty(node.type).label
}

export const getEditor = (node: Node) => {
    return getNodeProperty(node.type).editor
}

export const isNodeType = (value: string): boolean => {
    return Object.values(NodeType).includes(value as NodeType)
}

export const getMenuItemsByType = (types: NodeType[]): NodeMenuItem[] => {
    const items: NodeMenuItem[] = []

    for (const key in NODE_PROPERTIES) {
        if (types.includes(key as NodeType)) {
            items.push({
                type: key as NodeType,
                label: NODE_PROPERTIES[key as NodeType].label,
                shortLabel: NODE_PROPERTIES[key as NodeType].shortLabel
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
        node.type === NodeType.HTML_LINKED ||
        node.type === NodeType.HTML_MULTIPLE ||
        node.type === NodeType.CLICK ||
        node.type === NodeType.CLICK_MULTIPLE ||
        node.type === NodeType.LOGIN ||
        node.type === NodeType.WAIT ||
        node.type === NodeType.SCROLL
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

export const isHtmlNode = (node: Node): node is HtmlNode => {
    return node.type === NodeType.HTML
}

export const isLinkedHtmlNode = (node: Node): node is LinkedHtmlNode => {
    return node.type === NodeType.HTML_LINKED
}

export const isMultipleHtmlNode = (node: Node): node is MultipleHtmlNode => {
    return node.type === NodeType.HTML_MULTIPLE
}

export const isMultipleClickNode = (node: Node): node is MultipleClickNode => {
    return node.type === NodeType.CLICK_MULTIPLE
}

export const isRoot = (node: Node) => {
    return !node.parent
}

export const getNewCollectField = (): CollectField => ({
    id: uuid(),
    label: '',
    selector: {
        value: '',
        attribute: Attributes.TEXT
    }
})

export const getNewNode = (type: NodeType): Node => {
    return { id: uuid(), type, ...getDefaultProps(type) }
}
