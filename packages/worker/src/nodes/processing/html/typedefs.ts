import { Page } from 'puppeteer'
import { FlowNode, NodeType, BranchNode } from '../../../typedefs/node'

export type HtmlNode = FlowNode & {
    type: NodeType.HTML
    link: string
    parsedLink?: string
}

export interface MultipleHtmlNode extends BranchNode {
    type: NodeType.HTML
    links: string[]
    limit?: number
    parsedLink?: string
}

export type LinkedHtmlNode = FlowNode & {
    type: NodeType.HTML_LINKED
    linkedField: string
    parsedLink?: string
}

export interface HtmlParseResult {
    html: string
    url: string
}

export interface LinkParseResult {
    page: Page
    parsedLink: string
}
