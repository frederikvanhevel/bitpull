import { FlowNode, NodeType } from '../../../typedefs/node';
export declare type SlackNode = FlowNode & {
    type: NodeType.SLACK;
    channel: string;
};
export interface SlackMessage {
    text?: string;
    attachments?: [{
        fallback: string;
        pretext: string;
        title: string;
        title_link: string;
    }];
}
