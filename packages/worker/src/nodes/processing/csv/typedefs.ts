import { FlowNode, NodeType } from '../../../typedefs/node'

export type CsvNode = FlowNode & {
    type: NodeType.CSV
}
