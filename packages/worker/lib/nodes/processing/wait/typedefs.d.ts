import { FlowNode, NodeType } from '../../../typedefs/node';
export declare type WaitNode = FlowNode & {
    type: NodeType.WAIT;
    delay: number;
};
