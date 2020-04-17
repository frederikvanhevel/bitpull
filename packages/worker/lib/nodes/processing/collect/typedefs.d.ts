import { FlowNode, NodeType } from '../../../typedefs/node';
import { HTMLSelector } from '../selectors';
export declare type CollectField = {
    id: string;
    label: string;
    selector: HTMLSelector;
};
export declare type CollectNode = FlowNode & {
    type: NodeType.COLLECT;
    fields: CollectField[];
    append?: boolean;
    limit?: number;
};
export declare type CollectParseResult = object | object[];
