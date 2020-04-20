import { FlowNode } from '../../../typedefs/node'

export type XmlNode = FlowNode & {
    type: 'XML'
    link?: string
    linkedField?: string
    parseJavascript?: boolean
    parsedLink?: string
}
