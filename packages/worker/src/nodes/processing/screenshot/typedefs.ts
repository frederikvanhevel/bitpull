import { FlowNode, NodeType } from '../../../typedefs/node'

export type ScreenshotNode = FlowNode & {
    type: NodeType.SCREENSHOT
    fullPage?: boolean
}
