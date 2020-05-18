import { FlowNode, NodeType } from '../../../typedefs/node'

export type FunctionNode = FlowNode & {
    type: NodeType.FUNCTION
    function: (data: any) => void | Promise<void>
}
