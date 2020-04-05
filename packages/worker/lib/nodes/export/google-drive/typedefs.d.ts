import { FlowNode, NodeType } from '../../../typedefs/node';
export declare type GoogleDriveNode = FlowNode & {
    type: NodeType.GOOGLE_DRIVE;
    filename: string;
};
