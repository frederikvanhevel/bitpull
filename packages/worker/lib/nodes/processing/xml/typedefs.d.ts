import { FlowNode } from '../../../typedefs/node';
export declare type XmlNode = FlowNode & {
    type: 'XML';
    link?: string;
    linkedField?: string;
    parseJavascript?: boolean;
    parsedLink?: string;
};
