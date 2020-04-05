import { FlowNode, NodeType } from '../../../typedefs/node'

export type HtmlNode = FlowNode & {
    type: NodeType.HTML
    link?: string
    linkedField?: string
    parseJavascript?: boolean
    parsedLink?: string
    disallowUndefined?: boolean
    delay?: number
    waitForNavigation?: boolean
}

export interface HtmlParseResult {
    html: string
    url: string
}
