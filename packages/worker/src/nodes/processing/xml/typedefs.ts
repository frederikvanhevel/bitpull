import { FlowNode, NodeType } from '../../../typedefs/node'

export type XmlNode = FlowNode & {
    type: NodeType.XML
    link?: string
    linkedField?: string
    parseJavascript?: boolean
    parsedLink?: string
}
