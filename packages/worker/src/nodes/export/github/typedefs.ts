import { FlowNode, NodeType } from '../../../typedefs/node'

export type GithubNode = FlowNode & {
    type: NodeType.GITHUB
    repo: string
}
