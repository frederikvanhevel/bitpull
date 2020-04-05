import { FlowNode, NodeType } from '../../../typedefs/node';
export declare type ScreenshotNode = FlowNode & {
    type: NodeType.SCREENSHOT;
    fullPage?: boolean;
};
