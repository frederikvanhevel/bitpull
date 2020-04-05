import { FlowNode, NodeType } from '../../../typedefs/node'

export type GoogleDriveNode = FlowNode & {
    type: NodeType.GOOGLE_DRIVE
    filename: string
}
