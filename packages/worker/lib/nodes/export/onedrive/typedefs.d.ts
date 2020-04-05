import { FlowNode, NodeType } from '../../../typedefs/node';
export declare type OnedriveNode = FlowNode & {
    type: NodeType.ONEDRIVE;
    filename: string;
};
