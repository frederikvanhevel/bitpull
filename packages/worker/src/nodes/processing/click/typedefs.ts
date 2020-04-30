import { FlowNode, NodeType, BranchNode } from '../../../typedefs/node'

export type ClickNode = FlowNode & {
    type: NodeType.CLICK
    selector: string
    delay?: number
    waitForNavigation?: boolean
}

export interface MultipleClickNode extends BranchNode {
    type: NodeType.CLICK_MULTIPLE
    selector: string
    limit?: number
    delay?: number
    waitForNavigation?: boolean
}
