import { FlowNode, NodeType } from '../../../typedefs/node';
export declare type XmlNode = FlowNode & {
    type: NodeType.XML;
    link?: string;
    linkedField?: string;
    parseJavascript?: boolean;
    parsedLink?: string;
};
