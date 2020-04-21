import { FlowNode, NodeType } from '../../../typedefs/node';
import { HTMLSelector } from '../selectors';
export declare type ScrollNode = FlowNode & {
    type: NodeType.SCROLL;
    element?: HTMLSelector;
};
