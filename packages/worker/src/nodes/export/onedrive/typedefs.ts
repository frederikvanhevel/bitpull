import { FlowNode, NodeType } from '../../../typedefs/node'

export type OnedriveNode = FlowNode & {
    type: NodeType.ONEDRIVE
    filename: string
}
