import { NodeType, FlowNode, NodeParser } from '../typedefs/node'
import { HtmlNode } from '../nodes/processing/html/typedefs'
import { XmlNode } from '../nodes/processing/xml/typedefs'
import { FlowError } from './errors'
import absolutify from './absolutify'

const FILE_NODES = [
    NodeType.PDF,
    NodeType.EXCEL,
    NodeType.JSON,
    NodeType.SCREENSHOT
]

export const IMPORT_PATHS: Record<NodeType, string> = {
    [NodeType.COLLECT]: '../nodes/processing/collect',
    [NodeType.HTML]: '../nodes/processing/html',
    [NodeType.XML]: '../nodes/processing/xml',
    [NodeType.PAGINATION]: '../nodes/processing/pagination',
    [NodeType.CLICK]: '../nodes/processing/click',
    [NodeType.LOGIN]: '../nodes/processing/login',
    [NodeType.EXCEL]: '../nodes/processing/excel',
    [NodeType.JSON]: '../nodes/processing/json',
    [NodeType.SCREENSHOT]: '../nodes/processing/screenshot',
    [NodeType.PDF]: '../nodes/processing/pdf',
    [NodeType.WAIT]: '../nodes/processing/wait',
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
    const linkNode = node as HtmlNode | XmlNode

    return (
        (linkNode.type === NodeType.HTML || linkNode.type === NodeType.XML) &&
        !!linkNode.link
    )
}

export const getModule = async (
    type: NodeType
): Promise<NodeParser<FlowNode>> => {
    if (!IMPORT_PATHS[type]) {
        throw new FlowError(`Node parser missing for type ${type}`)
    }

    const importedModule = await import(IMPORT_PATHS[type])

    return importedModule.default
}

export const isFileNode = (type: NodeType) => {
    return FILE_NODES.includes(type)
}

export const absolutifyHtml = (
    html: string,
    url: string,
    proxyEndpoint: string = ''
) => {
    const origin = new URL(url).origin
    const cssImportRegex = /url\("?([/][^/].*?)"?\)/gm
    return absolutify(
        html,
        (url: string) => proxyEndpoint + encodeURIComponent(origin + url)
    ).replace(
        cssImportRegex,
        (m: any, $1: string) =>
            `url(${proxyEndpoint + encodeURIComponent(origin + $1)})`
    )
}
