import { FlowNode, NodeType } from '../../../typedefs/node';
export declare type ClickNode = FlowNode & {
    type: NodeType.CLICK;
    selector: string;
    delay?: number;
    waitForNavigation?: boolean;
};
