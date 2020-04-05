import { FlowNode, NodeType } from '../../../typedefs/node'

export type ExcelNode = FlowNode & {
    type: NodeType.EXCEL
}
