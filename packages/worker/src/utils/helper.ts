import { NodeType, FlowNode, NodeParser, BranchNode } from '../typedefs/node'
import { HtmlNode } from '../nodes/processing/html/typedefs'
import { XmlNode } from '../nodes/processing/xml/typedefs'
import { FlowError } from './errors'

const FILE_NODES = [
    NodeType.PDF,
    NodeType.EXCEL,
    NodeType.CSV,
    NodeType.JSON,
    NodeType.SCREENSHOT
]

const EXPORT_NODES = [
    NodeType.STORAGE,
    NodeType.WEBHOOK,
    NodeType.DROPBOX,
    NodeType.GOOGLE_DRIVE,
    NodeType.ONEDRIVE,
    NodeType.GITHUB,
    NodeType.FUNCTION
]

export const IMPORT_PATHS: Record<NodeType, string> = {
    [NodeType.COLLECT]: '../nodes/processing/collect',
    [NodeType.HTML]: '../nodes/processing/html',
    [NodeType.HTML_MULTIPLE]: '../nodes/processing/html/multiple',
    [NodeType.PAGINATION]: '../nodes/processing/pagination',
    [NodeType.CLICK]: '../nodes/processing/click',
    [NodeType.LOGIN]: '../nodes/processing/login',
    [NodeType.EXCEL]: '../nodes/processing/excel',
    [NodeType.CSV]: '../nodes/processing/csv',
    [NodeType.JSON]: '../nodes/processing/json',
    [NodeType.SCREENSHOT]: '../nodes/processing/screenshot',
    [NodeType.PDF]: '../nodes/processing/pdf',
    [NodeType.WAIT]: '../nodes/processing/wait',
    [NodeType.SCROLL]: '../nodes/processing/scroll',
    [NodeType.FUNCTION]: '../nodes/export/function',
    [NodeType.DROPBOX]: '../nodes/export/dropbox',
    [NodeType.GOOGLE_DRIVE]: '../nodes/export/google-drive',
    [NodeType.ONEDRIVE]: '../nodes/export/onedrive',
    [NodeType.GITHUB]: '../nodes/export/github',
    [NodeType.STORAGE]: '../nodes/export/storage',
    [NodeType.WEBHOOK]: '../nodes/export/webhook',
    [NodeType.SLACK]: '../nodes/notification/slack',
    [NodeType.EMAIL]: '../nodes/notification/email'
}

export const isRootNode = (node: FlowNode): boolean => {
    const linkNode = node as HtmlNode
    return linkNode.type === NodeType.HTML && !!linkNode.link
}

export const getModule = async (
    type: NodeType
): Promise<NodeParser<FlowNode>> => {
    if (!IMPORT_PATHS[type]) {
        throw new FlowError(`Node parser missing for type ${type}`)
    }

    // @ts-ignore
    const importedModule = await import(IMPORT_PATHS[type])

    return importedModule.default
}

export const isFileNode = (type: NodeType) => {
    return FILE_NODES.includes(type)
}

export const isExportNode = (type: NodeType) => {
    return EXPORT_NODES.includes(type)
}

export const hasChildOfTypes = (node: FlowNode, types: NodeType[]) => {
    return node.children?.find(child => types.includes(child.type))
}

export const hasChildExportNodes = (node: FlowNode) => {
    return hasChildOfTypes(node, EXPORT_NODES)
}

export const isBranchCollectNode = (node: FlowNode) => {
    return (
        node.type === NodeType.COLLECT &&
        hasChildOfTypes(node, [NodeType.HTML]) &&
        !!(node.children![0] as HtmlNode).linkedField
    )
}

export const isBranchNode = (node: FlowNode) => {
    return !!(node as BranchNode).goToPerPage || isBranchCollectNode(node)
}
