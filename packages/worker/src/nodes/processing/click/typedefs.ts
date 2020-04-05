import { FlowNode, NodeType } from '../../../typedefs/node'

export type ClickNode = FlowNode & {
    type: NodeType.CLICK
    selector: string
    delay?: number
    waitForNavigation?: boolean
}
