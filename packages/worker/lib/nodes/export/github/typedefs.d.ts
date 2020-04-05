import { FlowNode, NodeType } from '../../../typedefs/node';
export declare type GithubNode = FlowNode & {
    type: NodeType.GITHUB;
    repo: string;
};
